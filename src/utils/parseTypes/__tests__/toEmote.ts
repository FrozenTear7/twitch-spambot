import toEmote from '../toEmote'

describe('toEmote', () => {
  test('properly parses an Emote', () => {
    const emote = {
      id: '0',
      name: 'KappaLOL',
    }

    expect(toEmote(emote)).toStrictEqual(emote)
  })

  test('properly throws an Error for missing parameters', () => {
    expect(() => toEmote({})).toThrowError('Incorrect or missing parameter: id')
    expect(() =>
      toEmote({
        somethingElse: 0,
      })
    ).toThrowError('Incorrect or missing parameter: id')
    expect(() =>
      toEmote({
        id: 'test',
      })
    ).toThrowError('Incorrect or missing parameter: name')
  })
})
