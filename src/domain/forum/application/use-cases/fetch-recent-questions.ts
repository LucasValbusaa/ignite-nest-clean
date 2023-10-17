import { QuestionRepository } from '../repositories/question-repository'
import { Question } from '../../enterprise/entities/question'
import { Either, right } from '@/core/either'
import { Injectable } from '@nestjs/common'

type FetchRecentQuestionUseCaseRequest = {
  page: number
}

type FetchRecentQuestionUseCaseResponse = Either<
  null,
  {
    question: Question[]
  }
>

@Injectable()
export class FetchRecentQuestionUseCase {
  constructor(private questionRepository: QuestionRepository) {}

  async execute({
    page,
  }: FetchRecentQuestionUseCaseRequest): Promise<FetchRecentQuestionUseCaseResponse> {
    const question = await this.questionRepository.findManyRecent({ page })

    return right({
      question,
    })
  }
}
