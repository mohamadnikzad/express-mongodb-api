import Router from 'express';
import {verify} from '../middlewares/verifyToken';
import {Movie} from '../models';
import {IMovie} from '../models/Movie';

const router = Router();

//create
router.post('/', verify, async (req, res) => {
    //@ts-ignore
    if (req.user.isAdmin) {
        const newMovie = new Movie(req.body);
        try {
            const movie = await newMovie.save();
            res.status(201).json(movie);
        } catch (error) {
            //@ts-ignore
            res.status(422).json(error.message);
        }
    } else {
        res.status(403).json('not allowed');
    }
});

//update
router.put('/:id', verify, async (req, res) => {
    //@ts-ignore
    if (req.user.isAdmin) {
        try {
            const updateMovie = await Movie.findByIdAndUpdate(
                req.params.id,
                {
                    $set: req.body
                },
                {new: true}
            );
            res.status(200).json(updateMovie);
        } catch (error) {
            res.status(500).json(error);
        }
    } else {
        res.status(403).json('not allowed');
    }
});

//DELETE
router.delete('/:id', verify, async (req, res) => {
    //@ts-ignore
    if (req.user.isAdmin) {
        try {
            await Movie.findByIdAndDelete(req.params.id);
            res.status(200).json('Movie has been deleted ...');
        } catch (error) {
            res.status(500).json('something went wrong!');
        }
    } else return res.status(403).json('not allowed!');
});

//GET RANDOM
router.get('/random', verify, async (req, res) => {
    const type = req.query.type;
    let movie: any;
    try {
        if (type === 'series')
            movie = await Movie.aggregate([
                {$match: {isSeries: true}},
                {$sample: {size: 1}}
            ]);
        else
            movie = await Movie.aggregate([
                {$match: {isSeries: false}},
                {$sample: {size: 1}}
            ]);
        res.status(200).json(...movie);
    } catch (error) {
        res.status(500).json('server err');
    }
});

//GET ONE
router.get('/:id', verify, async (req, res) => {
    //@ts-ignore
    try {
        const movie = await Movie.findById(req.params.id);
        //@ts-ignore
        const info = movie._doc;
        if (movie) return res.status(200).json(info);
        else return res.status(404).json('not found');
    } catch (error) {
        res.status(500).json(error);
    }
});

//GET ALL
router.get('/', verify, async (req, res) => {
    const type = req.query.type;
    const isPersian: any = !!req.query.isPersian;
    //@ts-ignore
    if (req.user.isAdmin) {
        try {
            let movies: IMovie[];
            //all persian
            if (isPersian === true) {
                console.log('here');
                movies = await Movie.find({isPersian: true});
            }
            //all none persian
            if (isPersian === false)
                movies = await Movie.find({isPersian: false});
            //movies
            if (type === 'movies') movies = await Movie.find({isSeries: false});
            //series
            if (type === 'series') movies = await Movie.find({isSeries: true});
            //persian series
            if (type === 'series' && isPersian === true)
                movies = await Movie.find({isSeries: true, isPersian: true});
            //foreign series
            if (type === 'series' && isPersian === false)
                movies = await Movie.find({isSeries: true, isPersian: false});
            //persian movies
            if (type === 'movies' && isPersian === true)
                movies = await Movie.find({isSeries: false, isPersian: true});
            //foreign movies
            if (type === 'movies' && isPersian === false)
                movies = await Movie.find({isSeries: false, isPersian: false});
            if (!type && !isPersian) movies = await Movie.find();
            return res.status(200).json(movies!.reverse());
        } catch (error) {
            return res.status(500).json(error);
        }
    }
    res.status(403).json('not allowed!');
});

export default router;
