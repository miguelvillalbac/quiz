var models = require('../models/models.js');
// GET /quizes


exports.index = function(req, res){
	if(req.query.search){
		models.Quiz.findAll({where: ["pregunta like ?", "%"+req.query.search.replace(" ","%")+"%"]}).then(
			function(quizes){
				res.render('quizes/index.ejs', {quizes: quizes});
			}
		).catch(function(error){next(error);});
	}else{
		models.Quiz.findAll().then(function(quizes){
			res.render('quizes/index.ejs',{quizes:quizes});
		}).catch(function(error){next(error);});
	}
};


exports.show = function(req, res){
	models.Quiz.find(req.params.quizId).then(function(quiz){

		res.render('quizes/show', { quiz: quiz});

		})
	};
	

exports.answer = function(req, res){
	models.Quiz.find(req.params.quizId).then(function(quiz){


	if(req.query.respuesta === quiz.respuesta){
		res.render('quizes/answer', {quiz: quiz, respuesta: 'Correcto'});
	}else{
		res.render('quizes/answer', {quiz: quiz, respuesta: 'Incorrecto'});
		}
	})
};

exports.author = function(req, res){
	res.render('author.ejs', {quiz: req.quiz});
};

