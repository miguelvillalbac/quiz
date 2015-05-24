var models = require('../models/models.js');
var stadisticas = require('./statistics_controller.js');
// GET /quizes


// Autoload : id
exports.load = function(req, res, next, quizId) {
	models.Quiz.find({
		where: { id: Number(quizId)},
		include: [{ model: models.Comment}]
	}).then(function(quiz) {
		if (quiz) {
			req.quiz = quiz;
			next();
		} else{ 
			next(new Error('No existe quizId=' + quizId))}
		}
	).catch(function(error){next(error)});
};


exports.index = function(req, res){
	if(req.query.search){
		models.Quiz.findAll({where: ["pregunta like ?", "%"+req.query.search.replace(" ","%")+"%"]}).then(
			function(quizes){
				res.render('quizes/index.ejs', {quizes: quizes, errors: []});
			}
		).catch(function(error){next(error);});
	}else{
		models.Quiz.findAll().then(function(quizes){
			res.render('quizes/index.ejs',{quizes:quizes, errors: []});
		});
	}
};


exports.show = function(req, res){

		res.render('quizes/show', { quiz: req.quiz, errors: []});

	};
	
//GET /quizes/:id/edit
exports.edit =function(req, res){
	var quiz = req.quiz;
	res.render('quizes/edit', {quiz: quiz, errors: []});
};

exports.answer = function(req, res){
	if(req.query.respuesta === req.quiz.respuesta){
		res.render('quizes/answer.ejs', {quiz: req.quiz, respuesta: 'correcta', errors: []});
	}else{
		res.render('quizes/answer.ejs', {quiz: req.quiz, respuesta: 'incorrecta.', errors: []});
	}
	
};
//GET /quizes/new
exports.new = function(req, res){

var quiz = models.Quiz.build(
	{pregunta: "Pregunta", respuesta: "Respuesta"}
	);
res.render('quizes/new', {quiz: quiz, errors: []});
	};


//POST /quizes/create

exports.create = function(req, res){
	var quiz = models.Quiz.build(req.body.quiz);
	stadisticas.aumentarNumPreguntas();
	quiz.validate().then(
		function(err){
			if(err){
				res.render('quizes/new', {quiz: quiz, errors: err.errors});

			}else{
				quiz.save({fields: ["pregunta", "respuesta"]}).then(function(){
		res.redirect('/quizes')})
			}
		}
		);
};

//PUT /quizes/:id

exports.update = function(req, res){

	req.quiz.pregunta = req.body.quiz.pregunta;
	req.quiz.respuesta = req.body.quiz.respuesta;

	req.quiz.validate().then(
function(err){
if(err){
	res.render('quizes/edit', {quiz: req.quiz, errors: err.errors});
}else{
	req.quiz.save({fields: ["pregunta", "respuesta"]})
	.then(function(){ res.redirect('/quizes');});
}
}
		);
};



//DELETE /quizes/:id
exports.destroy = function(req, res){
	req.quiz.destroy().then( function(){
		res.redirect('/quizes');
	}).catch(function(error){next(error)});
};


exports.author = function(req, res){
	res.render('author.ejs', {quiz: req.quiz, errors: []});
};

