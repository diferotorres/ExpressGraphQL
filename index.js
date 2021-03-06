const express = require('express');
const app = express();

const express_graphql = require('express-graphql');
const { buildSchema } = require('graphql');

//data
const { courses } = require('./data.json');
const schema = buildSchema(`
    type Query {
        course(id: Int!): Course
        courses(topic: String): [Course]
    }
    
    type Mutation{
        updateCourse(id: Int!, topic: String!): Course
        createCourse(input: CourseInput): Course
    }
    type Course {
       id: Int
       title: String
       author: String
       topic: String
       url: String 
    }
    input CourseInput{
       title: String
       author: String
       topic: String
       url: String
    }` 
);

let getCourse = (args) => {
    let id = args.id;
    return courses.filter(course => {
        return course.id == id;
    })[0];
}

let getCourses = (args) => {
    if(args.topic){
        let topic = args.topic;
        return courses.filter(course => course.topic === topic);
     }
     else{
         return courses;
     }
}

let updateCourseTopic = ({id, topic}) => {
    courses.map(course => {
        if(course.id === id){
            course.topic = topic;
            return course;
        }
    });
    return courses.filter(course => course.id === id)[0];
}
let createNewCourse = ({input}) =>{
    input.id = courses.length;
    courses.push(input);
    return input;
}
const root = {
    course: getCourse,
    courses: getCourses,
    updateCourse: updateCourseTopic,
    createCourse: createNewCourse
}

app.use('/graphql', express_graphql({
    schema: schema,
    rootValue: root,
    graphiql: true
}));

app.listen(4000, () => console.log('listening on port 4000'));