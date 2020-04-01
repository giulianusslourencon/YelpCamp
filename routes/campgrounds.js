var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");

// INDEX ROUTE
router.get("/", function (req, res) {
    Campground.find({}, function (err, campgrounds) {
        if (err)
            console.log(err);
        else
            res.render("campgrounds/index", {
                campgrounds: campgrounds
            });
    });
});

// NEW ROUTE
router.get("/new", middleware.isLoggedIn, function (req, res) {
    res.render("campgrounds/new");
});

// CREATE ROUTE
router.post("/", middleware.isLoggedIn, function (req, res) {
    var newCampground = {
        name: req.body.name,
        price: req.body.price,
        image: req.body.image,
        description: req.body.description,
        author: {
            id: req.user._id,
            username: req.user.username
        }
    };
    Campground.create(newCampground, function (err, campground) {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/campgrounds");
        }
    });
});

// SHOW ROUTE
router.get("/:id", function (req, res) {
    Campground.findById(req.params.id).populate("comments").exec(function (err, campground) {
        if (err)
            console.log(err);
        else
            res.render("campgrounds/show", {
                campground: campground
            });
    });
});

// EDIT ROUTE
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res) {
    Campground.findById(req.params.id, function (err, campground) {
        res.render("campgrounds/edit", {
            campground: campground
        });        
    });
});

// UPDATE ROUTE
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res) {
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function (err, campground) {
        if (err)
            console.log(err);
        else
            res.redirect("/campgrounds/" + req.params.id);
    });
});

// DESTROY ROUTE
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res) {
    Campground.findByIdAndRemove(req.params.id, function(err) {
        res.redirect("/campgrounds");
    });
});

module.exports = router;