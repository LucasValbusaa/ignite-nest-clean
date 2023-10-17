import { Either, left, right } from './either'

function doSomething(shouldSuccess: boolean): Either<string, string> {
  if (shouldSuccess) {
    return right('success')
  } else {
    return left('error')
  }
}

test('success result', () => {
  const success = doSomething(true)

  expect(success.isRight()).toBeTruthy()
  expect(success.isLeft()).toBeFalsy()
})

test('error result', () => {
  const error = doSomething(false)

  expect(error.isRight()).toBeFalsy()
  expect(error.isLeft()).toBeTruthy()
})
