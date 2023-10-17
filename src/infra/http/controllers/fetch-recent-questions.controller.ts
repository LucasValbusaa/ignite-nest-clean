import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  Query,
} from '@nestjs/common'

import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe'

import { z } from 'zod'
import { FetchRecentQuestionUseCase } from '@/domain/forum/application/use-cases/fetch-recent-questions'
import { QuestionPresenter } from '../presenters/http-question-presenter'

const pageQueryParamsSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1))

type PageQueryParamsSchema = z.infer<typeof pageQueryParamsSchema>

const queryValidationPipe = new ZodValidationPipe(pageQueryParamsSchema)

@Controller('/questions')
export class FetchRecentQuestionsController {
  constructor(private fetchQuestions: FetchRecentQuestionUseCase) {}

  @Get()
  @HttpCode(200)
  async handle(
    @Query('page', queryValidationPipe) page: PageQueryParamsSchema,
  ) {
    const result = await this.fetchQuestions.execute({ page })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const questions = result.value.question

    return { questions: questions.map(QuestionPresenter.toHTTP) }
  }
}
