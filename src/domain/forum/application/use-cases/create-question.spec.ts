import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { CreateQuestionUseCase } from './create-question'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { InMemoryQuestionAttachmentRepository } from 'test/repositories/in-memory-question-attachment-repository'
import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachment-repository'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-register-students-repository'

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryAttachmentRepository: InMemoryAttachmentsRepository
let inMemoryStudentRepository: InMemoryStudentsRepository
let inMemoryQuestionAttachmentRepository: InMemoryQuestionAttachmentRepository
let sut: CreateQuestionUseCase

describe('Create Question', () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentRepository =
      new InMemoryQuestionAttachmentRepository()

    inMemoryAttachmentRepository = new InMemoryAttachmentsRepository()

    inMemoryStudentRepository = new InMemoryStudentsRepository()

    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentRepository,
      inMemoryAttachmentRepository,
      inMemoryStudentRepository,
    )
    sut = new CreateQuestionUseCase(inMemoryQuestionsRepository)
  })

  it('should be able to create a question', async () => {
    const result = await sut.execute({
      authorId: '1',
      content: 'any_content',
      title: 'any_title',
      attachmentsIds: ['1', '2'],
    })

    const items = inMemoryQuestionsRepository.items[0]

    expect(result.isRight()).toBeTruthy()
    expect(items).toStrictEqual(result.value?.question)
    expect(items.attachments.currentItems).toHaveLength(2)
    expect(items.attachments.currentItems).toEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityID('1') }),
      expect.objectContaining({ attachmentId: new UniqueEntityID('2') }),
    ])
  })

  it('should persist attachments when creating new question', async () => {
    const result = await sut.execute({
      authorId: '1',
      content: 'any_content',
      title: 'any_title',
      attachmentsIds: ['1', '2'],
    })

    const items = inMemoryQuestionAttachmentRepository.items

    expect(result.isRight()).toBeTruthy()
    expect(items).toHaveLength(2)
    expect(items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          attachmentId: new UniqueEntityID('1'),
        }),
        expect.objectContaining({
          attachmentId: new UniqueEntityID('2'),
        }),
      ]),
    )
  })
})
