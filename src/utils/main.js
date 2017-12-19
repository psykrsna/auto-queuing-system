import moment from 'moment';

export function timeDuration(time){
  let now = moment(new Date());
  let start = moment(time);
  let duration = moment.duration(now.diff(start));
  let days = duration.days();
  let hours = duration.hours();
  let minutes = duration.minutes();
  let seconds = duration.seconds();
  let timeSince = '';
  if(parseInt(hours, 10) < 1){
    if(parseInt(minutes, 10) < 5){
      timeSince = minutes+' min '+seconds+' sec';
    }
    else{
      timeSince = minutes+' min';
    }
  }
  else if(parseInt(hours, 10) < 24){
    timeSince = hours+' hr';
  }
  else{
    timeSince = days+' days ';
  }
  return timeSince;
}