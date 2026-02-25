const currentUser = JSON.parse(localStorage.getItem("currentUser"));
if(!currentUser){
    window.location.href="/index.html"
}
const profileUserName= document.getElementById("profileUserName");
const profileEmail = document.getElementById("profileEmail");
const profileRole = document.getElementById("profileRole");
const proflieCreatedAt = document.getElementById("profileCreatedAt");
const profileStatus =document.getElementById("profileStatus");

//-- Displaying the header of profile with current user
function ProfileDetails(){
    if(currentUser){
        profileUserName.innerText= currentUser.name;
        profileEmail.innerText=currentUser.email;
        profileRole.innerText=currentUser.role;
        proflieCreatedAt.innerText=currentUser.dateCreated;
        profileStatus.innerText=currentUser.status;
        document.getElementById('profileAvatar').innerText = currentUser.name.slice(0, 2).toUpperCase();
    }
}
ProfileDetails();
// Displaying the profile info of the current user
const profileinfoName =document.getElementById("profileInfoName");
const profileInfoEmail =document.getElementById("profileInfoEmail");
const profileInfoPhone =document.getElementById("profileInfoPhone");
const profileInfoDate =document.getElementById("profileInfoDate");
const profileInfoAddress= document.getElementById("profileInfoAddress");
function ProfileDisplayInfo(){
    if(currentUser){
        profileinfoName.innerText=currentUser.name;
        profileInfoEmail.innerText=currentUser.email;
        profileInfoPhone.innerText=currentUser.phone;
        profileInfoDate.innerText=currentUser.dateCreated;
        profileInfoAddress.innerText=currentUser.address;
    }
}
ProfileDisplayInfo();