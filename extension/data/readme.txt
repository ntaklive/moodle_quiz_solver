Put here any JSON file in the specified format and rename its to 'questions.json'

JSON file format:
[
  {
    text: "",
    answers: [
      "",
      ""
    ],
    rightAnswer: "",
    image: ""
  }
]

Use the quiz parser from the quiz_tools\questions_parser" folder, then use 'quiz_tools\questions_json_joiner' to join them all and remove duplicates.