import { InMemoryStudentsRepository } from 'test/repositories/in-memory-register-students-repository'
import { FakeHasher } from 'test/cryptography/fake-hasher'
import { AuthenticateStudentUseCase } from './authenticate-student'
import { FakeEncrypter } from 'test/cryptography/fake-encrypter'
import { makeStudent } from 'test/factories/make-student'

let inMemoryStudentRepository: InMemoryStudentsRepository
let fakeHasher: FakeHasher
let fakeEncrypter: FakeEncrypter
let sut: AuthenticateStudentUseCase

describe('Authenticate Student', () => {
  beforeEach(() => {
    inMemoryStudentRepository = new InMemoryStudentsRepository()
    fakeHasher = new FakeHasher()
    fakeEncrypter = new FakeEncrypter()

    sut = new AuthenticateStudentUseCase(
      inMemoryStudentRepository,
      fakeHasher,
      fakeEncrypter,
    )
  })

  it('should be able to authenticate a student', async () => {
    const student = makeStudent({
      email: 'johndoe@email.com',
      password: await fakeHasher.hash('12345'),
    })

    inMemoryStudentRepository.create(student)

    const result = await sut.execute({
      email: 'johndoe@email.com',
      password: '12345',
    })

    expect(result.isRight()).toBeTruthy()
    expect(result.value).toEqual({ accessToken: expect.any(String) })
  })
})
