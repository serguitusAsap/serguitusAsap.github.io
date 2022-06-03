window.addEventListener("load", function() {
    const images = [{
            id: "#camera",
            default: true,
            images: {
                original: {
                    src: "images/camera-1.jpg",
                    label: "2009",
                    credit: "Image Credit",
                },
                options: [{
                        id: "option1",
                        src: "images/camera-2.jpg",
                        label: "2014",
                        credit: "Image Credit",
                    },
                    {
                        id: "option2",
                        src: "images/camera-1.jpg",
                        label: "2014",
                        credit: "Image Credit",
                    },
                    {
                        id: "option3",
                        src: "images/camera-2.jpg",
                        label: "2014",
                        credit: "Image Credit",
                    },
                ],
            },
        },
        {
            id: "#sochi",
            images: {
                original: {
                    src: "images/Sochi_11April2005.jpg",
                    label: "2005",
                    credit: "Image Credit",
                },
                options: [{
                        id: "option1",
                        src: "images/Sochi_22Nov2013.jpg",
                        label: "2013",
                        credit: "Image Credit",
                    },
                    {
                        id: "option2",
                        src: "images/Sochi_11April2005.jpg",
                        label: "2005",
                        credit: "Image Credit",
                    },
                    {
                        id: "option3",
                        src: "images/Sochi_22Nov2013.jpg",
                        label: "2013",
                        credit: "Image Credit",
                    },
                ],
            },
        },
    ];
    const sliders = [];
    let slider;
    const parent = document.querySelector("#sliders");
    for (let pair of images) {
        let el = document.createElement("div");
        el.setAttribute("id", pair.id.substring(1));
        el.setAttribute("class", pair.default ? "" : "hidden");
        //el.addEventListener("click", showThis);
        parent.appendChild(el);
        slider = new juxtapose.JXSlider(pair.id, [
            pair.images.original,
            pair.images.options[0],
        ], {
            animate: true,
            showLabels: true,
            showCredits: true,
            startingPosition: "50%",
            makeResponsive: true,
        });
        sliders.push(slider);
    }
    thumbs = document.getElementsByClassName("thumb");
    for (t of thumbs) {
        t.addEventListener("click", showThis);
    }
});

function showThis(e) {
    const parent = document.querySelector("#sliders");
    for (item of parent.children) {
        item.classList.add("hidden");
    }
    const selected = document.querySelector(
        "#" + e.currentTarget.dataset["id"]
    );
    selected.classList.remove("hidden");

}

function changeRightImage() {

}