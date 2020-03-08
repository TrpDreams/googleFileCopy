function doGet(){
  //String array to convert numerical month to string
  var months = ['January', 'February',
                'March', 'April',
                'May', 'June',
                'July', 'August',
                'September', 'October',
                'November', 'December'];
  // Setting up variables
  var folderId, folderIdTwo, folderIdThree;
  var folderShift;
  var checkShift;
  var checkFolder;
  var newFile = DriveApp.getFileById('1Nno0B97uDIE7p9gRk9TqXqGeF5Z0V1X58oL3vbBsf4Q'); //File ID of the file to be copied - PLEASE DO NOT TOUCH THIS FILE - 1Nno0B97uDIE7p9gRk9TqXqGeF5Z0V1X58oL3vbBsf4Q
  var date = new Date();
  var numMonth = date.getMonth();
  var monthNum = (date.getMonth() + 1).toString();
//  Logger.log(monthNum + " FIRST MONTH NUMBER")
  var time = date.getUTCHours();
  var year = date.getFullYear();
  var leapYear = true;
  if(year % 4 != 0 || year % 100 == 0 && year % 400 != 0) {
    leapYear = false;
  }
  //Handling Mid shift date requirements
  if(time >= 5 && time < 7) {
    var day = date.getDate() + 1;
    day = '' + day;
    if(numMonth === 0 || numMonth === 2 || numMonth === 4 || numMonth === 6 || numMonth === 7 || numMonth === 9 || numMonth === 11) {
        if(day === '32') {
          numMonth += 1;
          monthNum = (date.getMonth() + 2).toString();
          day = '01';
        }
    }
    if(numMonth === 1) {
      if(day === '29' && leapYear === false) {
        numMonth += 1;
        monthNum = (date.getMonth() + 2).toString();
        day = '01';
      }
      else if(day === '30') {
        day = '02';
        numMonth += 1;
        monthNum = (date.getMonth() + 2).toString();
      }
    }
    else if(day === '31') {
      numMonth += 1;
      monthNum = (date.getMonth() + 2).toString();
      day = '01';
    }
  }
  else {
    var day = date.getDate().toString();
  }
  Logger.log(day);
  var month = months[numMonth];

  if(monthNum.length === 1) {
    monthNum = '0' + monthNum; //Padding single digit months with a 0
  }
  if (day.length === 1) {
    day = '0' + day; //Padding single digit days with a 0
  }

  //If time is between 6am and 2pm, create file for Day shift
  //If time is between 2pm and 10pm, create file for Swing shift
  //Otherwise, create file for Mid shift
  if(time >= 13 && time < 21) {
    checkShift = 'Days';
  }
  else if((time >= 21) || (time < 5)) {
    checkShift = 'Swings';
  }
  else {
    checkShift = 'Mids';
  }
  //String for the name of the current month
  var checkMonth = '' + monthNum + ' - ' + month;
//  Logger.log(checkMonth + "   CHECK MONTH VAR");
  //Starting from the daily log folder, find the year, then month, then shift
  var folderYear = DriveApp.getFolderById('1FNgoD1XIsw1jeYkuXPEJezO8ZLarwBD9').getFolders();
  while (folderYear.hasNext()) {
    var folder = folderYear.next();
    //When found, get the Id and load to folderID
    if(folder.getName() === '' + date.getFullYear()) {
      checkFolder = folder.getId();
      folderId = DriveApp.getFolderById(folder.getId()).getFolders();
//      Logger.log("Folder check 1")
    }
  }
  var folderMonth = DriveApp.getFolderById(checkFolder).getFolders();
//  Logger.log(folderMonth + "    folderMonth      " + checkFolder);
  while (folderMonth.hasNext()) {
    var folder = folderMonth.next();
//    Logger.log(folder +  "    -Folder");
    if(folder.getName() === checkMonth) {
      checkFolder = folder.getId();
      folderId = DriveApp.getFolderById(folder.getId()).getFolders();
//      Logger.log("Found the folder");
//      break;
    }
  }
  var folderShift = DriveApp.getFolderById(checkFolder).getFolders();
  while (folderShift.hasNext()) {
    var folder = folderShift.next();
//    Logger.log(folder + "    _Folder");
    if(folder.getName() === checkShift) {
      checkFolder = folder.getId();
      folderId = DriveApp.getFolderById(folder.getId());
//      Logger.log("Found the shift folder");
    }
  }
//  Logger.log("" + monthNum + '-' + day + '-' + date.getFullYear().toString().substr(-2));
  //Checking the folder iterator looking for a folder Id of the folder that matches the string folder name
  var files = DriveApp.getFolderById(checkFolder).getFilesByName('' + monthNum + '-' + day + '-' + date.getFullYear().toString().substr(-2)); //.getFilesByName(monthNum + '-' + day + '-' + date.getFullYear().toString().substr(-2));
  if(!files.hasNext()) {
//    Logger.log("-----");
//    Logger.log(monthNum);
//    Logger.log(day);
//    Logger.log(date.getFullYear().toString().substr(-2));
//    Logger.log(folderId);
    newFile.makeCopy(monthNum + '-' + day + '-' + date.getFullYear().toString().substr(-2), folderId);
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
