import toEmote from '../../../../src/utils/parseTypes/toEmote'

describe('toEmote', () => {
  test('properly parses an Emote', () => {
    const emote = {
      code: 'test',
      emoticon_set: 0,
      id: 0,
    }

    expect(toEmote(emote)).toStrictEqual(emote)
  })

  test('properly throws an Error for missing parameters', () => {
    expect(() => toEmote({})).toThrowError(
      'Incorrect or missing parameter: code'
    )
    expect(() =>
      toEmote({
        somethingElse: 0,
      })
    ).toThrowError('Incorrect or missing parameter: code')
    expect(() =>
      toEmote({
        code: 'test',
        somethingElse: 0,
      })
    ).toThrowError('Incorrect or missing parameter: emoticon_set')
    expect(() =>
      toEmote({
        code: 'test',
        emoticon_set: 0,
        somethingElse: 0,
      })
    ).toThrowError('Incorrect or missing parameter: id')
  })
})
