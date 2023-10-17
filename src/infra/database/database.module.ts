import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { PrismaQuestionRepository } from './prisma/repositories/prisma-question-repository'
import { PrismaAnswersCommentsRepository } from './prisma/repositories/prisma-answers-comments-repository'
import { PrismaQuestionCommentsRepository } from './prisma/repositories/prisma-question-comments-repository'
import { PrismaQuestionAttachmentsRepository } from './prisma/repositories/prisma-question-attachments-repository'
import { PrismaAnswersRepository } from './prisma/repositories/prisma-answers-repository'
import { PrismaAnswersAttachmentsRepository } from './prisma/repositories/prisma-answers-attachments-repository'
import { QuestionRepository } from '@/domain/forum/application/repositories/question-repository'
import { StudentsRepository } from '@/domain/forum/application/repositories/students-repository'
import { PrismaStudentRepository } from './prisma/repositories/prisma-student-repository'
import { QuestionCommentsRepository } from '@/domain/forum/application/repositories/question-comments-repository'
import { QuestionAttachmentRepository } from '@/domain/forum/application/repositories/question-attachment-repository'
import { AnswerAttachmentsRepository } from '@/domain/forum/application/repositories/answer-attachments-repository'
import { AnswerCommentsRepository } from '@/domain/forum/application/repositories/answer-comments-repository'
import { AnswersRepository } from '@/domain/forum/application/repositories/answers-repository'
import { AttachmentRepository } from '@/domain/forum/application/repositories/attachments-repository'
import { PrismaAttachmentsRepository } from './prisma/repositories/prisma-attachments-repository'
import { NotificationRepository } from '@/domain/notification/application/repositories/notifications-repository'
import { PrismaNotificationRepository } from './prisma/repositories/prisma-notification-repository'
import { CacheModule } from '../cache/cache.module'

@Module({
  imports: [CacheModule],
  providers: [
    PrismaService,
    {
      provide: QuestionAttachmentRepository,
      useClass: PrismaQuestionAttachmentsRepository,
    },
    {
      provide: QuestionCommentsRepository,
      useClass: PrismaQuestionCommentsRepository,
    },
    { provide: QuestionRepository, useClass: PrismaQuestionRepository },
    {
      provide: AnswerAttachmentsRepository,
      useClass: PrismaAnswersAttachmentsRepository,
    },
    {
      provide: AnswerCommentsRepository,
      useClass: PrismaAnswersCommentsRepository,
    },
    { provide: AnswersRepository, useClass: PrismaAnswersRepository },
    { provide: StudentsRepository, useClass: PrismaStudentRepository },
    {
      provide: AttachmentRepository,
      useClass: PrismaAttachmentsRepository,
    },
    {
      provide: NotificationRepository,
      useClass: PrismaNotificationRepository,
    },
  ],
  exports: [
    PrismaService,
    QuestionAttachmentRepository,
    QuestionCommentsRepository,
    QuestionRepository,
    AnswerAttachmentsRepository,
    AnswerCommentsRepository,
    AnswersRepository,
    StudentsRepository,
    AttachmentRepository,
    NotificationRepository,
  ],
})
export class DatabaseModule {}
