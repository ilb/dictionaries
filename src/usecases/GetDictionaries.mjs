export default class GetDictionaries {
  constructor({ dictionaryRepository }) {
    this.dictionaryRepository = dictionaryRepository;
  }
  async process({ parentCode, code }) {
    const rows = await this.dictionaryRepository.getDictionaries({ parentCode, code });

    return rows.map(({ code, name }) => ({ code, name }));
  }

  async schema() {
    return {
      type: 'object',
      properties: {
        parentCode: {
          title: 'Код родителя',
          type: 'string'
        },
        code: {
          title: 'Код',
          type: 'string'
        }
      },
      required: ['parentCode']
    };
  }
}
