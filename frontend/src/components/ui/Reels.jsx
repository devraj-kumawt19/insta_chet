import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { apiGet } from "../../utils/api";
import toast from "react-hot-toast";

import {
    MdKeyboardArrowUp,
    MdKeyboardArrowDown,
    MdFavoriteBorder,
    MdFavorite,
    MdComment,
} from "react-icons/md";


const Reels = () => {

    const [reels, setReels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentReelIndex, setCurrentReelIndex] = useState(0);
    const [likedReels, setLikedReels] = useState(new Set());


    const fetchReels = async () => {

        try {

            setLoading(true);

            const response = await apiGet("/api/stories/feed");

            setReels(response || []);

        } catch (error) {

            toast.error(
                error.message || "Failed to load reels"
            );

        } finally {

            setLoading(false);

        }

    };



    useEffect(() => {

        fetchReels();

    }, []);



    const currentReel =
        reels[currentReelIndex];



    const handleNext = () => {

        if (currentReelIndex < reels.length - 1) {

            setCurrentReelIndex(
                currentReelIndex + 1
            );

        }

    };



    const handlePrev = () => {

        if (currentReelIndex > 0) {

            setCurrentReelIndex(
                currentReelIndex - 1
            );

        }

    };



    const toggleLike = () => {

        const newLiked =
            new Set(likedReels);


        if (
            newLiked.has(currentReelIndex)
        ) {

            newLiked.delete(
                currentReelIndex
            );

        } else {

            newLiked.add(
                currentReelIndex
            );

        }


        setLikedReels(newLiked);

    };




    if (loading) {

        return (

            <div className="
			w-full h-full
			flex items-center justify-center
			">

                <motion.div

                    animate={{
                        rotate: 360
                    }}

                    transition={{
                        repeat: Infinity,
                        duration: 1
                    }}

                    className="text-4xl"

                >

                    🎬

                </motion.div>

            </div>

        )

    }




    if (reels.length === 0) {

        return (

            <div className="
		w-full h-full
		flex items-center justify-center
		">

                <div className="text-center">

                    <div className="text-6xl">
                        🎥
                    </div>

                    <h2 className="
				text-2xl font-bold
				">
                        No Reels Yet
                    </h2>

                    <p>
                        Share your first reel
                    </p>

                </div>


            </div>

        )

    }




    return (

        <div className="
w-full h-full
flex flex-col
overflow-hidden
">


            <div className="
flex-1
relative
bg-black
flex
items-center
justify-center
">


                <AnimatePresence mode="wait">


                    {
                        currentReel &&


                        <motion.div

                            key={currentReelIndex}

                            initial={{
                                opacity: 0
                            }}

                            animate={{
                                opacity: 1
                            }}

                            exit={{
                                opacity: 0
                            }}

                            className="
relative
w-full
h-full
max-w-2xl
"

                        >


                            <img

                                src={currentReel.image}

                                alt="reel"

                                className="
w-full
h-full
object-cover
"

                            />



                            <div className="
absolute
inset-0
bg-gradient-to-t
from-black/70
to-transparent
"/>




                            <div className="
absolute
bottom-8
left-6
text-white
">


                                <p className="font-bold">

                                    {currentReel.creatorName}

                                </p>


                                <p className="text-sm">

                                    @{currentReel.creatorUsername}

                                </p>



                                <p className="mt-3">

                                    {currentReel.description}

                                </p>


                            </div>





                            <div className="
absolute
right-5
bottom-24
flex
flex-col
gap-5
">


                                <button
                                    onClick={toggleLike}
                                >


                                    {
                                        likedReels.has(currentReelIndex)

                                            ?

                                            <MdFavorite
                                                className="
text-red-500
text-4xl
"
                                            />

                                            :

                                            <MdFavoriteBorder
                                                className="
text-white
text-4xl
"
                                            />

                                    }


                                </button>




                                <button>

                                    <MdComment
                                        className="
text-white
text-4xl
"
                                    />

                                </button>


                            </div>





                            {
                                currentReelIndex > 0 &&


                                <button

                                    onClick={handlePrev}

                                    className="
absolute
left-5
top-1/2
text-white
"

                                >

                                    <MdKeyboardArrowUp
                                        className="text-5xl"
                                    />

                                </button>

                            }




                            {
                                currentReelIndex < reels.length - 1 &&


                                <button

                                    onClick={handleNext}

                                    className="
absolute
right-5
top-1/2
text-white
"

                                >

                                    <MdKeyboardArrowDown
                                        className="text-5xl"
                                    />

                                </button>


                            }



                        </motion.div>


                    }


                </AnimatePresence>


            </div>



            <div className="
bg-black
text-white
text-center
py-3
">

                {currentReelIndex + 1}
                /
                {reels.length}

            </div>



        </div>


    )

}


export default Reels;