import React, { Component } from 'react'
import axios from "axios"

export class Movie extends Component {
    state = {
        movieInput: "",
        movieList: [],
        isToggle: false,
        updatedInput: "",
    }

    componentDidMount = async () => {
        try {
            let allMovies = await axios.get("http://localhost:3001/movie/get-all-movies")

            this.setState({
                movieList: allMovies.data.data,
            })
        } catch (e) {
            console.log(e)
        }
    }

    handleMovieInputOnChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value,
        })
    }

    handleMovieSubmit = async () => {
        try {
            let createdMovie = await axios.post("http://localhost:3001/movie/create-movie",
                { movie: this.state.movieInput })
            // console.log(createdMovie)

            let newMovieArrayList = [...this.state.movieList, createdMovie.data.data,]
            this.setState({
                movieList: newMovieArrayList,
            })
        } catch (e) {
            console.log(e)
        }
    }

    handleDeleteByParamsID = async (id) => {
        try {
            let deletedMovie = await axios.delete(`http://localhost:3001/movie/delete-movie/${id}`)

            let newDeletedMovieArray = this.state.movieList.filter((item) =>
                item._id !== deletedMovie.data.data._id
            )
            this.setState({
                movieList: newDeletedMovieArray,
            })
        } catch (e) {
            console.log(e)
        }
    }

    updatedOnChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value,
        })
    }

    handleUpdateByID = async (movie) => {
        this.setState((prevState) => {
            return {
                isToggle: !prevState.isToggle,
                updatedInput: movie.movie,
            }
        })
        try {
            let updatedTitle = await axios.put(
                `http://localhost:3001/movie/update-movie/${movie._id}`, {
                movie: this.state.updatedInput,
            }
            )
            let updatedTitleListArray = this.state.movieList.map((item) => {
                if (item._id === updatedTitle.data.data._id) {
                    item.movie = updatedTitle.data.data.movie
                }
                return item
            })
            this.setState({
                movieList: updatedTitleListArray,
            })
        } catch (e) {
            console.log(e)
        }
    }

    render() {
        return (
            <div style={{ margin: 30, textAlign: "center" }}>
                <div style={{ margin: "30px 30px " }}>
                    <input
                        type="text"
                        name="movieInput"
                        value={this.state.movieInput}
                        onChange={this.handleMovieInputOnChange}
                    />
                </div>
                <br />
                <button style={{ marginBottom: 10 }} onClick={this.handleMovieSubmit}>
                    Submit
                    </button>
                <br />

                {this.state.movieList.map((item) => {
                    return (
                        <div key={item._id}>
                            {this.state.isToggle ? (
                                <input
                                    type="text"
                                    name="updatedInput"
                                    value={this.state.updatedInput}
                                    onChange={this.updateOnChange}
                                />
                            ) : (
                                    <span style={{ margin: "10px" }}>{item.movie}</span>
                                )}
                            <button
                                onClick={() => this.handleUpdateByID(item)}
                                style={{ margin: "10px" }}
                                className="btn btn-primary"
                            >
                                Update
                            </button>
                            <button
                                onClick={() => this.handleDeleteByParamsID(item._id)}
                                style={{ margin: "10px" }}
                                className="btn btn-danger"
                            >
                                Delete
                            </button>
                        </div>
                    )
                })}
            </div>
        )
    }
}

export default Movie

