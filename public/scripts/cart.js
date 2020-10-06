// setTimeout(() => {
//     alert("script connected");
// }, 100);


function setDeleteActions() {
    $("span.deleteButton").click((event) => {
        // $.post("/cart/remove", {
        //     "_method": "PUT",
        //     "id":"123"
        // }, (result) => {
        //     console.log("finished");
        // });
        // console.log(event.target);
        // console.log($( this ).attr('data'));
    });
}
setDeleteActions();
