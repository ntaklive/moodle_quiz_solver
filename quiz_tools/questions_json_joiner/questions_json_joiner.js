const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'jsons_to_join');

let allQuestionsArray = [];

let files = fs.readdirSync(directoryPath);
files.forEach((file) => {
    let json = fs.readFileSync(path.join(directoryPath, file), 'utf8');
    let questions = JSON.parse(json);

    questions.forEach((question) => {
        allQuestionsArray.push(question);
    })
});

const uniqueQuestionsArray = allQuestionsArray.filter((value, index) => {
    const _value = JSON.stringify(value);
    return index === allQuestionsArray.findIndex(obj => {
        return JSON.stringify(obj) === _value;
    });
});

console.log('Questions have processed: ' + allQuestionsArray.length)
console.log('Unique questions count: ' + uniqueQuestionsArray.length);

let resultFilePath = path.join(__dirname, 'result.json');
fs.writeFileSync(resultFilePath, JSON.stringify(uniqueQuestionsArray), "utf8");
console.log('The joining result was successfully saved to: ' + resultFilePath);
