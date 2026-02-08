// Based on the payload you shared (Moodle core_course_get_courses / similar)
interface MoodleCourseType {
  id: number;
  shortname: string;
  categoryid: number;
  categorysortorder: number;
  fullname: string;
  displayname: string;
  idnumber: string;

  summary: string;
  summaryformat: number;

  overviewfiles: OverviewFile[];

  format: string;

  showgrades: number;
  newsitems: number;

  startdate: number; // unix timestamp (seconds)
  enddate: number; // unix timestamp (seconds)

  numsections: number;

  maxbytes: number;
  showreports: number;

  visible: number;

  // Present in some courses, absent in others
  hiddensections?: number;

  groupmode: number;
  groupmodeforce: number;
  defaultgroupingid: number;

  timecreated: number; // unix timestamp (seconds)
  timemodified: number; // unix timestamp (seconds)

  enablecompletion: number;
  completionnotify: number;

  lang: string;

  // Present but empty in your sample
  forcetheme: string;

  courseformatoptions: MoodleCourseFormatOption[];

  showactivitydates: boolean;

  // Can be boolean OR null in your sample
  showcompletionconditions: boolean | null;
}

interface MoodleCourseFormatOption {
  name: string;
  value: number;
}

// Optional: the whole response shape you pasted
interface MoodleCoursesResponse {
  courses: MoodleCourseType[];
  meta: {
    offset: number;
    limit: number;
    count: number;
  };
}

interface OverviewFile {
  filename: string;
  filepath: string;
  filesize: number;
  fileurl: string;
  timemodified: number; // unix timestamp (seconds)
}
