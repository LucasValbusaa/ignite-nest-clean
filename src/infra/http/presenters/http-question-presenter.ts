import { Question } from '@/domain/forum/enterprise/entities/question'

type QuestionPresenterOutput = {
  id: string
  bestAnswerId: string | null
  title: string
  slug: string
  createdAt: Date
  updateAt: Date | null
}

export class QuestionPresenter {
  static toHTTP(question: Question): QuestionPresenterOutput {
    return {
      id: question.id.toString(),
      bestAnswerId: question.bestAnswerId
        ? question.bestAnswerId?.toString()
        : null,
      title: question.title,
      slug: question.slug.value,
      createdAt: question.createdAt,
      updateAt: question.updateAt ? question.updateAt : null,
    }
  }
}
