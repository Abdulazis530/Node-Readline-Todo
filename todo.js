const fs = require("fs");

const [, , command, ...list] = process.argv;
const taskComponent = list.join(" ");
const data = JSON.parse(fs.readFileSync("data.json", "utf8"));

const savetoDb = (data) => {
  const dataJson = JSON.stringify(data);
  fs.writeFileSync("data.json", dataJson);
};

const isComplete = (checkBox, status) => {
  const index = Number(taskComponent) - 1;
  const activity = `${checkBox} ${data[index].task.slice(4)}`;  
  data[index].task = activity;

  savetoDb(data);
  console.log(`"${data[index].task.slice(4)}" ${status}`);
};

const specialList = (checkBox) => {
  if (taskComponent === "asc") {
    console.log("Daftar Pekerjaan");

    data.forEach((pekerjaan, i) => {
      if (pekerjaan.task.slice(0, 3) === checkBox) {
        console.log(`${i + 1}. ${pekerjaan.task}.`);
      }
    });
  } else {
    console.log("Daftar Pekerjaan");
    for (let i = data.length - 1; i >= 0; i--) {
      if (data[i].task.slice(0, 3) === checkBox) {
        console.log(`${i + 1}. ${data[i].task}.`);
      }
    }
  }
};

if (command === "help") {
  console.log(
    `>>JS TODO<<\n$ node todo.js <command>\n$ node todo.js list\n$ node todo.js task <task_id>\n$ node todo.js add <task_content>\n$ node todo.js add <task_content>\n$ node todo.js complete <task_id>\n$ node todo.js delete <task_id>\n$ node todo.js uncomplete <task_id>\n$ node todo.js list:outstanding asc|desc\n$ node todo.js list:completed asc|desc\n$ node todo.js tag <task_id> <tag_name_1> <tag_name_2> ... <tag_name_N>\n$ node todo.js filter:<tag_name>`
  );
}
if (command === "add") {
  const bracketTaskCOmponent = `[ ] ${taskComponent}`;
  const todo = {
    task: bracketTaskCOmponent,
    tags: [],
  };

  data.push(todo);
  savetoDb(data);
  console.log(`"${taskComponent}" telah ditambahkan.`);
}
if (command === "list") {
  console.log("Daftar Pekerjaan");

  data.forEach((pekerjaan, i) => {
    console.log(`${i + 1}. ${pekerjaan.task}.`);
  });
}
if (command === "delete") {
  const deletedId = Number(taskComponent) - 1;

  if(deletedId<data.length){
    console.log(`"${data[deletedId].task.slice(4)}" telah dihapus dari daftar`);
    data.splice(deletedId, 1);
    savetoDb(data);
  }else{
    console.log(`list dengan id ${taskComponent} tidak ditemukan!`)
  }

}
if (command === "complete") {
  const index = Number(taskComponent) - 1;
  const checkBox = data[index].task.slice(0, 3);
  const statusMsg = `"status ${data[index].task.slice(4)}" memang sudah selesai, mungkin maksud anda ingin membatalkan status selesai "${data[index].task.slice(4)}" ? jika iya, masukan input "node todo.js uncomplete ${index + 1}"`;
  checkBox === "[ ]" ? isComplete("[x]", "telah selesai") : console.log(statusMsg);

}
if (command === "uncomplete") {
  const index = Number(taskComponent) - 1;
  const checkBox = data[index].task.slice(0, 3);
  const statusMsg = `"status ${data[index].task.slice(4)}" memang belum selesai, mungkin maksud anda status "${data[index].task.slice(4)}" sudah selesai ? jika iya, masukan input "node todo.js complete ${index + 1}"`;
  checkBox === "[x]" ? isComplete("[ ]", "status selesai dibatakan"): console.log(statusMsg);
}

if (command === "list:outstanding") {
  let checks = data.map((listTask) => listTask.task.slice(0, 3) === "[ ]");
  console.log(checks)

  if (checks.some((check) => check === true)) {
    specialList("[ ]");
  } else{
    console.log('Semua list sudah selesai dikerjakan, jika ingin menampilan semua aktivitas yang sudah dilakukan gunakan command "$node list:completed asc|desc"')
  }
}

if (command === "list:completed") {
  let checks = data.map((listTask) => listTask.task.slice(0, 3) === "[x]");

  if (checks.some((check) => check === true)) {
    specialList("[x]");
  } else{
    console.log('Semua list belum selesai dikerjakan, jika ingin menampilan semua aktivitas yang belum dikerjakan gunakan command "$node list:outstanding asc|desc"')
  }
}

if (command === "tag") {
  const [taskId, ...addedTags] = list;
  const index = Number(taskId) - 1;

  if(data[index].task.slice(0,3)==="[ ]"){
    addedTags.forEach((tag) => data[index].tags.push(tag));
    savetoDb(data);
   
    console.log(
      `Tag '${addedTags.join()}' telah ditambahkan ke daftar '${data[
        index
      ].task.slice(4)}'`
    );
  }else{
    console.log(`Tidak dapat menambahkan tag karena status "${data[index].task.slice(4)}" sudah selesai!`)
  }
  
}
if (command.slice(0, 6) === "filter") {
  const filteredTag = command.slice(7);

  data.forEach((listTask, i) => {
    listTask.tags.forEach((tag) => {
      if (tag === filteredTag) {
        console.log("Daftar Pekerjaan");
        console.log(`${i + 1}. ${listTask.task}.`);
      }
    });
  });
}
