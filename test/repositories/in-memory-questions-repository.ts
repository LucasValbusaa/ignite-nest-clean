import { DomainEvents } from '@/core/events/domain-events'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { QuestionRepository } from '@/domain/forum/application/repositories/question-repository'
import { Question } from '@/domain/forum/enterprise/entities/question'
import { QuestionDetails } from '@/domain/forum/enterprise/entities/value-objects/question-details'
import { InMemoryStudentsRepository } from './in-memory-register-students-repository'
import { InMemoryAttachmentsRepository } from './in-memory-attachment-repository'
import { InMemoryQuestionAttachmentRepository } from './in-memory-question-attachment-repository'

export class InMemoryQuestionsRepository implements QuestionRepository {
  public items: Question[] = []

  constructor(
    private questionAttachmentRepository: InMemoryQuestionAttachmentRepository,
    private attachmentsRepository: InMemoryAttachmentsRepository,
    private studentRepository: InMemoryStudentsRepository,
  ) {}

  async findById(id: string): Promise<Question | null> {
    const question = this.items.find((item) => item.id.toString() === id)

    if (!question) {
      return null
    }

    return question
  }

  async findBySlug(slug: string): Promise<Question | null> {
    const question = this.items.find((item) => item.slug.value === slug)

    if (!question) {
      return null
    }

    return question
  }

  async findDetailsBySlug(slug: string): Promise<QuestionDetails | null> {
    const question = this.items.find((item) => item.slug.value === slug)

    if (!question) {
      return null
    }

    const author = this.studentRepository.items.find((student) => {
      return student.id.equals(question.authorId)
    })

    if (!author) {
      throw new Error(
        `Author with ID "${question.authorId.toString()}" does not exists`,
      )
    }

    const questionAttachments = this.questionAttachmentRepository.items.filter(
      (questionAttachment) => {
        return questionAttachment.questionId.equals(question.id)
      },
    )

    const attachments = questionAttachments.map((questionAttachment) => {
      const attachmentFound = this.attachmentsRepository.items.find(
        (attachment) => {
          return attachment.id.equals(questionAttachment.attachmentId)
        },
      )

      if (!attachmentFound) {
        throw new Error(
          `Attachment with ID "${questionAttachment.attachmentId.toString()}" does not exists`,
        )
      }

      return attachmentFound
    })

    return QuestionDetails.create({
      questionId: question.id,
      authorId: question.authorId,
      author: author.name,
      attachments,
      title: question.title,
      content: question.content,
      slug: question.slug,
      bestAnswerId: question.bestAnswerId,
      createdAt: question.createdAt,
      updatedAt: question.updateAt,
    })
  }

  async create(question: Question): Promise<void> {
    this.items.push(question)

    this.questionAttachmentRepository.createMany(
      question.attachments.getItems(),
    )

    DomainEvents.dispatchEventsForAggregate(question.id)
  }

  async delete(question: Question): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === question.id)

    this.items.splice(itemIndex, 1)

    this.questionAttachmentRepository.deleteManyByQuestionId(
      question.id.toString(),
    )
  }

  async save(question: Question): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === question.id)

    this.items[itemIndex] = question

    this.questionAttachmentRepository.createMany(
      question.attachments.getNewItems(),
    )

    this.questionAttachmentRepository.deleteMany(
      question.attachments.getRemovedItems(),
    )

    DomainEvents.dispatchEventsForAggregate(question.id)
  }

  async findManyRecent({ page }: PaginationParams): Promise<Question[]> {
    const question = this.items
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((page - 1) * 20, page * 20)

    return question
  }
}
