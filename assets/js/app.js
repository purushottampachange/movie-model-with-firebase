const cl = console.log;

const movieForm = document.getElementById("movieForm");
const title = document.getElementById("title");
const imgPath = document.getElementById("imgPath");
const content = document.getElementById("content");
const rating = document.getElementById("rating");
const nfxBtn = document.getElementById("nfxBtn");
const movieModel = document.getElementById("movieModel");
const backDrop = document.getElementById("backDrop");


const submitBtn = document.getElementById("submitBtn");
const updateBtn = document.getElementById("updateBtn");
const movieContainer = document.getElementById("movieContainer");
const closeBtn = document.querySelectorAll(".closeBtn");


const BaseURL = "https://post-task-xhr-default-rtdb.firebaseio.com/";

const movieURL = "https://post-task-xhr-default-rtdb.firebaseio.com/movies.json";

const ConvertArray = (obj) => {

    let res = [];

    for (const key in obj) {

        let data = { ...obj[key], id: key }

        res.push(data);
    }

    return res;
}

const RatingClass = (rating) => {

    if (rating > 8) {

        return "badge-success";
    }
    else if (rating > 5 && rating <= 8) {

        return "badge-warning";
    }
    else {

        return "badge-danger";
    }
}


const SnackBar = (icon, msg) => {

    Swal.fire({
        title: msg,
        icon: icon,
        timer: 1500
    })
}

const onHideShow = () => {

    movieModel.classList.toggle("active");
    backDrop.classList.toggle("active");
}

const Templating = (arr) => {

    let res = "";

    arr.forEach(m => {

        res += `
        
            <div class="col-md-3 mb-4">
                <div class="card movieCard text-white">
                    <div class="card-header p-0">
                        <div class="row">
                            <div class="col-10">
                                <h5>${m.title}</h5>
                            </div>
                            <div class="col-2">
                                <h6> <span class="badge ${RatingClass(m.rating)}">${m.rating}</span></h6>
                            </div>
                        </div>
                    </div>
                    <div class="card-body p-0">
                        <figure>
                            <img src=${m.imgPath} alt="">
                            <figcaption>
                                <h5>${m.title}</h5>
                                <p>${m.content}</p>
                            </figcaption>
                        </figure>
                    </div>
                    <div class="card-footer d-flex justify-content-between p-0">
                        <button class="btn btn-sm btn-success">Edit</button>
                        <button class="btn btn-sm btn-danger">Remove</button>
                    </div>
                </div>
            </div>
          
        `;
    })

    movieContainer.innerHTML = res;
}

const CreateMovie = (obj, id) => {

    let div = document.createElement("div");

    div.className = "col-md-3 mb-4";

    div.id = id;

    div.innerHTML = `
      
             <div class="card movieCard text-white">
                    <div class="card-header p-0">
                        <div class="row">
                            <div class="col-10">
                                <h5>${obj.title}</h5>
                            </div>
                            <div class="col-2">
                                <h6> <span class="badge ${RatingClass(obj.rating)}">${obj.rating}</span></h6>
                            </div>
                        </div>
                    </div>
                    <div class="card-body p-0">
                        <figure>
                            <img src=${obj.imgPath} alt="">
                            <figcaption>
                                <h5>${obj.title}</h5>
                                <p>${obj.content}</p>
                            </figcaption>
                        </figure>
                    </div>
                    <div class="card-footer d-flex justify-content-between p-0">
                        <button class="btn btn-sm btn-success">Edit</button>
                        <button class="btn btn-sm btn-danger">Remove</button>
                    </div>
                </div>
    
    `;

    movieContainer.prepend(div);

    movieForm.reset();

    onHideShow();
}

const MakeAPICall = async (apiURL, method, msgBody) => {

    msgBody = msgBody ? JSON.stringify(msgBody) : null;

    let confihObj = {

        method: method,
        body: msgBody,
        headers: {

            "content-type": "aplication/json",
            "auth": "token from local storage"
        }
    }

    try {
        let res = await fetch(apiURL, confihObj);

        return res.json();

    }
    catch (err) {

        SnackBar("success", err);

    }
}


const fetchMovies = async () => {

    let res = await MakeAPICall(movieURL, "GET", null);

    let data = ConvertArray(res).reverse();

    Templating(data);
}

fetchMovies();

const onSubmit = async (eve) => {

    eve.preventDefault();

    let movieObj = {

        title: title.value,
        imgPath: imgPath.value,
        content: content.value,
        rating: rating.value,
    }
   
    cl(movieObj);

    let res = await MakeAPICall(movieURL, "POST", movieObj);

    CreateMovie(movieObj,res.name);
}


closeBtn.forEach(b => b.addEventListener("click", onHideShow))
nfxBtn.addEventListener("click", onHideShow);
movieForm.addEventListener("submit", onSubmit);