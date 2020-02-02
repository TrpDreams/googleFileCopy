function doGet(){
  //String array to convert numerical month to string
  var months = ['January', 'February',
                'March', 'April',
                'May', 'June',
                'July', 'August',
                'September', 'October',
                'November', 'December'];
  // Setting up variables
  var folderID;
  var newFile = DriveApp.getFileById('FILE_ID_GOES_HERE');
  var date = new Date();
  var numMonth = date.getMonth();
  var monthNum = (date.getMonth() + 1).toString();
  var time = date.getUTCHours();
  var year = date.getFullYear();
  var leapYear = true;
  if(year % 4 != 0 || year % 100 == 0 && year % 400 != 0) {
    leapYear = false;
  }
  //Handling Mid shift date requirements
  Logger.log(time);
  if(time >= 5 && time < 7) {
    var day = date.getDate() + 1;
    day = '' + day;
    if(numMonth === 0 || numMonth === 2 || numMonth === 4 || numMonth === 6 || numMonth === 7 || numMonth === 9 || numMonth === 11) {
        if(day === 32) {
          numMonth += 1;
          monthNum = date.getMonth().toString() + 2;
          day = '01';
        }
    }
    if(numMonth === 1) {
      if(day === 29 && leapYear === false) {
        numMonth += 1;
        monthNum = date.getMonth().toString() + 2;
        day = '01';
      }
      else if(day === 30) {
        numMonth += 1;
        monthNum = date.getMonth().toString() + 2;
        day = '01';
      }
    }
    else if(day === 31) {
      numMonth += 1;
      monthNum = date.getMonth().toString() + 2;
      day = '01';
    }
  }
  else {
    var day = date.getDate().toString();
  }

  var month = months[numMonth];

  if(monthNum.length === 1) {
    monthNum = '0' + monthNum; //Padding single digit months with a 0
  }
  if (day.length === 1) {
    day = '0' + day; //Padding single digit days with a 0
  }
  //Establishing string folder name - Month YYYY
  var folderName = '' + monthNum + ' - ' + month + ' ' + year; 
  var folders;
  //If time is between 6am and 2pm, create files for Day shift
  //If time is between 2pm and 10pm, create files for Swing shift
  //Otherwise, create files for Mid shift
  if(time >= 13 && time < 21) {
    folders = DriveApp.getFolderById('FOLDER_ID').getFolders();
  }
  else if((time >= 21) || (time < 5)) {
    folders = DriveApp.getFolderById('FOLDER_ID').getFolders();
  }
  else {
    folders = DriveApp.getFolderById('FOLDER_ID').getFolders();
  }

  //Checking the folder iterator looking for a folder Id of the folder that matches the string folder name
  var checkFolder;
  while (folders.hasNext()) {
    var folder = folders.next();
    //When found, get the Id and load to folderID
    if(folder.getName() === folderName) {
      checkFolder = folder.getId();
      folderID = DriveApp.getFolderById(folder.getId());
      
    }
  }
  
  //Creating Eastern Arc and Western Arc files for the day
  var files = DriveApp.getFolderById(checkFolder).getFilesByName('' + monthNum + '-' + day + '-' + date.getFullYear().toString().substr(-2)); //.getFilesByName(monthNum + '-' + day + '-' + date.getFullYear().toString().substr(-2));
  if(!files.hasNext()) {
    newFile.makeCopy(monthNum + '-' + day + '-' + date.getFullYear().toString().substr(-2), folderID);
    var HTMLString = "<style> h1,p {font-family: 'Helvitica', 'Arial'}</style>" + "<h1>Successful File Creation!</h1>";
    HTMLOutput = HtmlService.createHtmlOutput(HTMLString);
    return HTMLOutput;
  }
  else {
  //Output to let the user know folder creation was successful
  var HTMLString = "<style> h1,p {font-family: 'Helvitica', 'Arial'}</style>" + "<h1>File already exists, no file created.</h1>";
  HTMLOutput = HtmlService.createHtmlOutput(HTMLString);
  return HTMLOutput;
  }
};
