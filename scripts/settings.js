const settings = document.getElementsByTagName("body")[0];

(async () => {
  const { data } = await import("../script.js");
  console.log(data);
  const settingsFields = document.createElement("div");
  settingsFields.innerHTML = `
    <div id="settings" class="flex flex-col items-center w-3/4 m-auto p-20 gap-2.5">
    <h1 class="font-bold text-4xl uppercase text-gray-500 p-10">Profile</h1>
      <div class="flex flex-col gap-2 w-3/4 justify-center">
        <div class="flex flex-row gap-2">
          <div class="flex flex-col w-full gap-2">
            <h3>Nom d'utilisateur :</h3>
            <input id="username" class="p-2 px-4 min-w-64" name="username" placeholder=${data.username} value="" />
          </div>
          <div class="flex flex-col w-full gap-2">
            <h3>Email :</h3>
            <input class="p-2 px-4 min-w-64" name="email" placeholder=${data.email}" value="" />
          </div>
        </div>
        <div class="flex flex-row gap-2">
          <div class="flex flex-col w-full gap-2">
            <h3>Nouveau mot de passe :</h3>
            <input class="p-2 px-4 min-w-64" name="newPassword" type="password" placeholder="Un nouveau mot de passe" value="" />
          </div>
          <div class="flex flex-col w-full gap-2">
            <h3>Confirmation :</h3>
            <input class="p-2 px-4 min-w-64" name="confirmNewPassword" type="password" placeholder="Confirmer le nouveau mot de passe" value="" />
          </div>
        </div>
        <div class="flex justify-center gap-2 items-center">
        <div class="flex flex-col w-full gap-2">
          <h3>Mot de passe ( Obligatoire ) :</h3>
          <input class="p-2 px-4 min-w-64" name="password" type="password" placeholder="Votre mot de passe actuel" value="" />
        </div>
      </div>
      <div class="flex justify-center gap-2">
        <button class="w-fit py-4 px-10 my-6 bg-gray-400 text-gray-200 rounded-md hover:bg-gray-200 hover:text-gray-600 font-semibold">Sauvegarder</button>
      </div>
      </div>
      
    </div>`;
  settings.appendChild(settingsFields);
})();
