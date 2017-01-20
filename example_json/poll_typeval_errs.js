module.exports = {
  field: 'poll',
  errs: [
    {
      field: 'question',
      msg: 'question type must be a string'
    },
    {
      field: 'question',
      msg: 'question must be longer than 8 chars'
    },
    {
      field:'user_id',
      value: 'user_id isnt a string'
    },
    {
      field: 'user_id'
      msg: 'user_id is small'
    },
    {
      field: 'options',
      msg: 'options isnt an array'
    }
  ],
  valid: false,
  input_object: {}
}
