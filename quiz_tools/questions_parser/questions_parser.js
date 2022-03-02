(async () => {
    return await parseQuestions();
})();

function trimRightAnswer(rightAnswerText) {
    return rightAnswerText
        .replace('Your answer is incorrect.', '')
        .replace('The correct answer is: ', '')
        .replace('Правильный ответ: ', '');
}

async function getImage(node) {
    let hash = '';

    let imageNodes = node.getElementsByTagName('img');
    if (imageNodes.length > 0)
    {
        const img = imageNodes[0];

        let canvas = document.createElement('canvas');
        let context = canvas.getContext('2d');
        canvas.height = img.naturalHeight;
        canvas.width = img.naturalWidth;
        context.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight);

        hash = canvas.toDataURL();
    }

    return hash;
}

async function parseQuestions() {
    let questions = [];
    let hashStrings = [];

    let qTextNodes = document.getElementsByClassName('qtext');
    let qAnswerNodes = document.getElementsByClassName('answer');
    let qRightAnswerNodes = document.getElementsByClassName('rightanswer');
    let questionsCount = qRightAnswerNodes.length;

    for (let i = 0; i < questionsCount; i++) {

        const qText = qTextNodes[i].textContent;
        const qAnswers = qAnswerNodes[i].children;
        const qRightAnswer = trimRightAnswer(qRightAnswerNodes[i].textContent);
        const qImage = await getImage(qTextNodes[i]);

        // Sorted array of answers
        let answers = [];
        const answersCount = qAnswers.length;
        for (let i = 0; i < answersCount; i++) {
            const answerNode = qAnswers[i];

            // Trim question's numeration ('a.', 'b.' and etc.)
            let trimmedAnswer = answerNode.textContent.substring(3, qAnswers[i].textContent.length).trim();
            answers.push(trimmedAnswer);
        }
        answers.sort();

        // Generating of the hash string
        let hashString = qText;
        for (let k = 0; k < answers.length; k++) {
            const currentAnswer = answers[k];
            hashString += currentAnswer;
        }
        hashString += qImage;

        // Checks for the already existing question in array
        if (hashStrings.includes(hashString)) {
            continue;
        } else {
            hashStrings.push(hashString);
        }

        let question = {};
        question.text = qText;
        question.answers = answers;
        question.rightAnswer = qRightAnswer;
        question.image = qImage;

        questions.push(question);
    }

    console.log(JSON.stringify(questions));
    console.log('Questions have processed: ' + questionsCount)
    console.log('Unique questions count: ' + questions.length);
}