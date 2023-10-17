import { RegisterStudentUseCase } from './register-student'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-register-students-repository'
import { FakeHasher } from 'test/cryptography/fake-hasher'

let inMemoryStudentRepository: InMemoryStudentsRepository
let fakeHasher: FakeHasher
let sut: RegisterStudentUseCase

describe('Register Student', () => {
  beforeEach(() => {
    inMemoryStudentRepository = new InMemoryStudentsRepository()
    fakeHasher = new FakeHasher()

    sut = new RegisterStudentUseCase(inMemoryStudentRepository, fakeHasher)
  })

  it('should be able to register a new student', async () => {
    const result = await sut.execute({
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: '12345',
    })

    const firstItem = inMemoryStudentRepository.items[0]

    expect(result.isRight()).toBeTruthy()
    expect(result.value).toStrictEqual({ student: firstItem })
  })

  it('should hash student upon registration', async () => {
    const result = await sut.execute({
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: '12345',
    })

    const firstItem = inMemoryStudentRepository.items[0]
    const hashedPassword = await fakeHasher.hash('12345')

    expect(result.isRight()).toBeTruthy()
    expect(firstItem.password).toEqual(hashedPassword)
  })
})
