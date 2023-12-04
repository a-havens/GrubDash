const path = require("path");
const dishes = require(path.resolve("src/data/dishes-data"));
const nextId = require("../utils/nextId");


function list(req, res, next){
    res.json({data: dishes});//
}

function create(req, res){

    const {data: {name, description, price, image_url} = {} } = req.body; 

    

    const newDish = {
        id: nextId(),
        name,
        description,
        price,
        image_url,

    };

    dishes.push(newDish);
    res.status(201).json({data: newDish});
}

function read(req, res, next){
    const dish = res.locals.dish;
    res.json({data: dish});
 
}

function update(req, res, next){
    const dish = res.locals.dish;
    const {dishId} = req.params;
    const {data: {id, name, description, price, image_url} = {}} = req.body;

    if(!id || dishId === id){
        const updatedDish = {
            id: dishId,
            name,
            description,
            price,
            image_url,
        }

        res.json({data: updatedDish});
    }

    next({
        status: 400,
        message: `Dish id does not match route id. Dish: ${id}, Route: ${dishId}`,
    })
}

//Validation Functions 

function dishExists(req, res, next){
    const {dishId} = req.params; 
    const foundDish = dishes.find((dish) => dish.id === dishId);
    if (foundDish){
        res.locals.dish = foundDish;
        return next();
    }
    next({
        status: 404,
        message: `Dish id not found: ${dishId}`,
    });
}

function nameExists(req, res, next){
    const {data: {name} = {} } = req.body;

    if(name){
        return next();
    }
    
    next({
        status: 400,
        message: "Dish must include a name",
    })
}

function descriptionExists(req, res, next){
    const {data: {description} = {} } = req.body;

    if(description){
        return next();
    }
    
    next({
        status: 400,
        message: "Dish must include a description",
    }) 
}

function imageExists(req, res, next){
    const {data: {image_url} ={}} = req.body; 
    if(image_url){
        return next();
    }
    next({
        status: 400,
        message: "image_url",
    })
}

function priceExists(req, res, next){
    const {data: {price} = {}} = req.body;

    if(!price){
        next({
            status: 400,
            message: "Dish must include a price",
        })
    }
    else if(price <= 0){
        next({
            status: 400,
            message: "Dish must have a price greater than 0.",
        });
    }
    else if(typeof price != "number"){
        next({
            status: 400,
            message: "The Dish price must be a number.",
        })
    }

    return next();
}

//export functions
module.exports = {
    create:[
        nameExists,
        descriptionExists,
        imageExists,
        priceExists,
        create,
    ],
    read: [
        dishExists,
        read,
    ],
    update: [
      dishExists,
      nameExists,
      descriptionExists,
      imageExists,
      priceExists,
      update,
    ],
    list,
}