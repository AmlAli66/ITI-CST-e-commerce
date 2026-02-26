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
// Handling the edit modal
function  openEditModal(){
    document.getElementById('editName').value = currentUser.name;
    document.getElementById('editPhone').value = currentUser.phone;
    document.getElementById('editAddress').value = currentUser.address;
    new bootstrap.Modal(document.getElementById('editProfileModal')).show();
}
// Saving the editted 
function saveProfile(){
    // getting the new  values
    const newName = document.getElementById('editName').value.trim();
    const newPhone = document.getElementById('editPhone').value.trim();
    const newAddress = document.getElementById('editAddress').value.trim();
    // Validation
    if(!newName||!newPhone||!newAddress){
        alert("All Fields Are Required");
        return;
    }
    //-- add the validation spans here
    if(!isNaN(newName)|| !isNaN(newName[0])){
        alert("Name Can't be A number");
        return;
    }
    if(newPhone)
    ///
    // Assigning the new values to the currentUser
    currentUser.name = newName;
    currentUser.phone = newPhone;
    currentUser.address = newAddress;
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    // Finding the Current user inside the original Array
    let users = JSON.parse(localStorage.getItem('users')) || [];
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    if (userIndex !== -1) {
        users[userIndex].name = newName;
        users[userIndex].phone = newPhone;
        users[userIndex].address = newAddress;
        localStorage.setItem('users', JSON.stringify(users));
    }
    ProfileDetails();
    ProfileDisplayInfo();
    bootstrap.Modal.getInstance(document.getElementById('editProfileModal')).hide();
    window.location.reload();

}