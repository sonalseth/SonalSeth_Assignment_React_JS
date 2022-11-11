import { useState } from "react";
import { Button, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import IMovie from "../../model/IMovie";
import { addMovie,  deleteMovieById, getHigestMovieId, getMovieByTitle } from "../../services/movies";
import Rating from "../common/Rating";

type Props = {
    movie: IMovie
    path: string
    onRemove:(title:string) => void
};

const MovieListItem = ( { movie, path, onRemove } : Props ) => {
    const toastTimeout = 2000;
    const isFavouritePage = path === "favourite";

    const { id, title, storyline, ratings, posterurl } = movie;

    const average = (arr : number[]) => arr.reduce((a,b) => a + b, 0) / arr.length;
    var rating = parseInt(average(ratings).toFixed(2), 10) / 2;

    var cardText = storyline.length > 100 ? storyline.substring(0, 100) + '...' : storyline;

    var toPath = `${path}/${title}`

    const addMovieToFavourite = async (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        try {
            const movieByTitle = await getMovieByTitle("favourite", movie.title);
            if (movieByTitle !== null){
                toast.error("Already added in favourite!", { autoClose: toastTimeout })
                return;
            }

            const highestId = await getHigestMovieId("favourite");
            movie.id = highestId + 1;
            await addMovie("favourite", movie);
            toast.success("Successfully added in favourite!", { autoClose: toastTimeout })
        }
        catch (errormsg : any) {
            toast.error("Failed to add the movie!", { autoClose: toastTimeout })
        }
    };

    const removeMovieFromFavourite = async (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        try {
            if (movie.id === null){
                toast.warn("Deletion of a movie without id not implemented");
            }
            const data = await deleteMovieById("favourite", movie.id);
            toast.success("Successfully removed from favourite!", { autoClose: toastTimeout })
            onRemove(movie.title);
        }
        catch (errormsg : any) {
            toast.error("Failed to remove from favourite", { autoClose: toastTimeout })
        }
    };

    return (
        <Card style={{ width: '18rem' }}>
            <Card.Img variant="top" height={350} src={`${posterurl}`} />
            <Card.Body>
                <Card.Title className="d-flex justify-content-between">
                    <div className="text-xs">
                        {title}
                        <div>
                            <Rating rating={rating}/>
                            {rating} ({ratings.length} rated)
                        </div>
                    </div>
                    <div>
                        <Link to={toPath} className="btn btn-primary btn-sm">
                            More
                        </Link>
                    </div>
                </Card.Title>
                <Card.Text>
                    <span>
                        <strong>Story Line</strong>: {cardText}
                    </span>
                </Card.Text>
                <Button hidden={isFavouritePage} onClick={addMovieToFavourite} variant="primary">Add to favourite</Button>
                <Button hidden={!isFavouritePage} onClick={removeMovieFromFavourite} variant="danger">Remove from favourite</Button>
            </Card.Body>
        </Card>
    );
};

export default MovieListItem