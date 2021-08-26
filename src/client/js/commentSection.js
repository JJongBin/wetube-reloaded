
const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");
// const btn = form.querySelector("button");

const addComment = (text, id) => {
    const videoComments = document.querySelector(".video__comments ul");
    const newComment = document.createElement("li");
    newComment.dataset.id = id;
    newComment.className = "video__comment";
    const icon = document.createElement("i");
    icon.className = "fas fa-comment";
    const span = document.createElement("span");
    const span2 = document.createElement("span");
    span.innerText = " ❌";
    span.innerText = ` ${text}`;
    newComment.appendChild(icon);
    newComment.appendChild(span);
    newComment.appendChild(span2);
    videoComments.prepend(newComment);
}

const handleSubmit = async (event) => {
    event.preventDefault();
    
    const textarea = form.querySelector("textarea");
    const text = textarea.value;
    const videoId = videoContainer.dataset.id;
    if (text === "") {
        return;
    }
    const response = await fetch(`/api/videos/${videoId}/comment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
    });
    // window.location.reload();
    
    
    if (response.status === 201) {
        textarea.value = "";
        const { newCommentId } = await response.json();
        console.log(newCommentId)
        addComment(text, newCommentId);
    }
}


// const handleDelete = () => {
//     const videoId = videoContainer.dataset.id;
//     const response = await fetch(`/api/${videoId}/comment`, {
//         method: "DELETE",
//         // headers: {
//         //   "Content-Type": "application/json",
//         // },
//         // body: JSON.stringify({ text }),
//     });
// }











if (form) {
    form.addEventListener("submit", handleSubmit);


}

