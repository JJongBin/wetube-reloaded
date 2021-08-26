
const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");
const deleteBtn = document.querySelectorAll(".deleteCommentBtn");
// console.log(deleteBtn)
// const btn = form.querySelector("button");

const addComment = (text, id) => {
    const videoComments = document.querySelector(".video__comments ul");
    const newComment = document.createElement("li");
    newComment.dataset.id = id;
    newComment.className = "video__comment";
    const icon = document.createElement("i");
    icon.className = "fas fa-comment";
    const span = document.createElement("span");
    span.innerText = ` ${text}`;
    const span2 = document.createElement("span");
    span2.innerText = " ❌";
    span2.className = "deleteCommentBtn";
    newComment.appendChild(icon);
    newComment.appendChild(span);
    newComment.appendChild(span2);
    videoComments.prepend(newComment);
    span2.addEventListener("click", handleDelete);
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
        // console.log(newCommentId)
        addComment(text, newCommentId);
    }
}



const handleDelete = async (event) => {
    // console.log(event.target.parentNode)
    const commentId = event.target.parentNode.dataset.id;
    const videoId = videoContainer.dataset.id;
    await fetch(`/api/${commentId}/comment`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ videoId }),
    });
    // console.log(commentId)
    // console.log(videoId)
    event.target.parentNode.remove();
}


for (let i = 0; i < deleteBtn.length; i++) {
    // console.log(deleteBtn[i].parentNode);
    deleteBtn[i].addEventListener("click", handleDelete);
}








if (form) {
    form.addEventListener("submit", handleSubmit);


}

