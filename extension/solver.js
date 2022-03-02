async function solve() {
    const questionsUrl = chrome.runtime.getURL('./data/questions.json');

    let data = await fetch(questionsUrl).then((response) => response.json());

    let answerDivs = document.getElementsByClassName("answer")[0].children;

    let currentQuestion = parseQuestion();
    for (let i = 0; i < answerDivs.length; i++) {
        let text = answerDivs[i].children[1].children[1].textContent;
        let input = answerDivs[i].children[0];

        let question = data.find((question) => isQuestionsEquals(question, currentQuestion));
        if (text === question.rightAnswer) {
            input.click();
        }
    }
}

function getImage(node) {
    let hash = '';

    let imageNodes = node.getElementsByTagName('img');
    if (imageNodes.length > 0) {
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

function parseQuestion() {
    let textNode = document.getElementsByClassName('qtext')[0];
    let answersNode = document.getElementsByClassName('answer')[0];

    let question = {};
    question.text = parseText(textNode);
    question.answers = parseAnswers(answersNode);
    question.rightAnswer = "";
    question.image = getImage(textNode);

    return question;
}

function isQuestionsEquals(question1, question2) {
    if (question1.text !== question2.text) return false;
    if (question1.image !== question2.image) return false;
    if (question1.answers.length !== question2.answers.length) return false;

    for (let i = 0; i < question1.answers.length; i++) {
        const q1AnswerText = question1.answers[i];
        const q2AnswerText = question2.answers[i];

        if (q1AnswerText !== q2AnswerText) return false;
    }

    return true;
}

function parseText(textNode) {
    return textNode.textContent;
}

function parseAnswers(answersNode) {
    let answers = answersNode.children;
    let answersArray = [];
    for (let i = 0; i < answers.length; i++) {
        const answerNode = answers[i];
        let trimmedAnswer = answerNode.textContent.substring(3, answers[i].textContent.length).trim();
        answersArray.push(trimmedAnswer);
    }
    answersArray.sort();

    return answersArray;
}

function startup() {
    window.addEventListener("load", function (event) {
        document.getElementsByClassName('answer')[0].childNodes[0].childNodes[1].childNodes[0].addEventListener('contextmenu', async(event) => {
            event.preventDefault();
            await solve();
        });
    });
}

startup();