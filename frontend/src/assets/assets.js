import home_banner from './home_banner.png'
import profile_pic from './profile_pic.png'
import logo from './logo.png'
import dropdown_icon from './dropdown_icon.svg'
import info_icon from './info_icon.svg'
import upload_icon from './upload_icon.png'
import upload_area from './upload_area.png'
// import wor1 from './wor1.png'
// import wor2 from './wor2.png'
// import wor3 from './wor3.png'
// import wor4 from './wor4.png'
// import wor5 from './wor5.png'
// import wor6 from './wor6.png'
// import wor7 from './wor7.png'
// import wor8 from './wor8.png'
// import wor9 from './wor9.png'
// import wor10 from './wor10.png'



export const assets = {
    home_banner,
    logo,
    info_icon,
    profile_pic,
    dropdown_icon,
    upload_icon,
    upload_area
}



export const faqs = [
  {
    question: "How do I request a waste pickup?",
    answer:
      "Go to the 'Report Waste' section, fill in the waste details including type and quantity and submit your request. You will receive a confirmation once a worker is assigned.",
  },
  {
    question: "Who collects the waste?",
    answer:
      "Certified EcoBin workers collect waste from your registered location. They follow safety guidelines and proper segregation practices for recycling and disposal.",
  },
 {
    question: "How are reward points calculated?",
    answer:
      "Reward points depend on waste type, quantity, and successful pickup confirmation.",
  },
  {
    question: "What if my pickup is delayed?",
    answer:
      "If your scheduled pickup is delayed, you will get a notification. You can also contact our support team via the 'Help & Support' section to reschedule or get assistance.",
  },
  {
    question: "What types of waste are accepted?",
    answer:
      "EcoBin accepts segregated waste such as recyclables (plastic, paper, metal), organic waste, and electronic waste. Hazardous waste like chemicals or medical waste is not accepted.",
  },
  {
    question: "How can I track my pickup request?",
    answer:
      "You can track your pickup request in the 'My Reports' section. It will show the current status (Pending, Assigned, In Process, Completed) and the assigned worker details.",
  },
  {
    question: "How do I contact support?",
    answer:
      "For any queries or issues, go to the 'Help & Support' section in the app. You can contact us via email, phone, or submit a support request through the contact form.",
  },
];



// export const workers = [
//   {
//     _id: "w001",
//     name: "Rahul Kumar",
//     email: "rahul1@gmail.com",
//     password: "rahul123",
//     phone: "9876543210",
//     image: wor1,
//     status: "Available",
//     shift: "Morning",
//     zone: "East Zone",
//     isActive: true,
//     totalTasksCompleted: 4,
//     currentTask: { reportId: null, assignedAt: null },
//     address: { street: "Sector 1", city: "Lucknow" },
//   },
//   {
//     _id: "w002",
//     name: "Amit Verma",
//     email: "amit2@gmail.com",
//     password: "amit123",
//     phone: "9876543211",
//     image: wor2,
//     status: "Assigned",
//     shift: "Evening",
//     zone: "West Zone",
//     isActive: true,
//     totalTasksCompleted: 7,
//     currentTask: { reportId: null, assignedAt: null },
//     address: { street: "Sector 4", city: "Lucknow" },
//   },
//   {
//     _id: "w003",
//     name: "Suresh Yadav",
//     email: "suresh3@gmail.com",
//     password: "suresh123",
//     phone: "9876543212",
//     image: wor3,
//     status: "Available",
//     shift: "Night",
//     zone: "North Zone",
//     isActive: true,
//     totalTasksCompleted: 2,
//     currentTask: { reportId: null, assignedAt: null },
//     address: { street: "Sector 7", city: "Kanpur" },
//   },
//   {
//     _id: "w004",
//     name: "Ravi Singh",
//     email: "ravi4@gmail.com",
//     password: "ravi123",
//     phone: "9876543213",
//     image: wor4,
//     status: "Available",
//     shift: "Morning",
//     zone: "South Zone",
//     isActive: true,
//     totalTasksCompleted: 10,
//     currentTask: { reportId: null, assignedAt: null },
//     address: { street: "Sector 2", city: "Delhi" },
//   },
//   {
//     _id: "w005",
//     name: "Deepak Sharma",
//     email: "deepak5@gmail.com",
//     password: "deepak123",
//     phone: "9876543214",
//     image: wor5,
//     status: "Available",
//     shift: "Evening",
//     zone: "East Zone",
//     isActive: true,
//     totalTasksCompleted: 6,
//     currentTask: { reportId: null, assignedAt: null },
//     address: { street: "Sector 9", city: "Lucknow" },
//   },
//   {
//     _id: "w006",
//     name: "Manoj Patel",
//     email: "manoj6@gmail.com",
//     password: "manoj123",
//     phone: "9876543215",
//     image: wor6,
//     status: "Available",
//     shift: "Night",
//     zone: "West Zone",
//     isActive: true,
//     totalTasksCompleted: 1,
//     currentTask: { reportId: null, assignedAt: null },
//     address: { street: "Sector 3", city: "Varanasi" },
//   },
//   {
//     _id: "w007",
//     name: "Vikas Mishra",
//     email: "vikas7@gmail.com",
//     password: "vikas123",
//     phone: "9876543216",
//     image: wor7,
//     status: "Available",
//     shift: "Morning",
//     zone: "North Zone",
//     isActive: true,
//     totalTasksCompleted: 8,
//     currentTask: { reportId: null, assignedAt: null },
//     address: { street: "Sector 10", city: "Kanpur" },
//   },
//   {
//     _id: "w008",
//     name: "Ankit Jain",
//     email: "ankit8@gmail.com",
//     password: "ankit123",
//     phone: "9876543217",
//     image: wor8,
//     status: "Available",
//     shift: "Evening",
//     zone: "South Zone",
//     isActive: true,
//     totalTasksCompleted: 12,
//     currentTask: { reportId: null, assignedAt: null },
//     address: { street: "Sector 6", city: "Delhi" },
//   },
//   {
//     _id: "w009",
//     name: "Pankaj Gupta",
//     email: "pankaj9@gmail.com",
//     password: "pankaj123",
//     phone: "9876543218",
//     image: wor9,
//     status: "Available",
//     shift: "Night",
//     zone: "East Zone",
//     isActive: true,
//     totalTasksCompleted: 3,
//     currentTask: { reportId: null, assignedAt: null },
//     address: { street: "Sector 8", city: "Lucknow" },
//   },
//   {
//     _id: "w010",
//     name: "Arjun Tiwari",
//     email: "arjun10@gmail.com",
//     password: "arjun123",
//     phone: "9876543219",
//     image: wor10,
//     status: "Available",
//     shift: "Morning",
//     zone: "West Zone",
//     isActive: true,
//     totalTasksCompleted: 9,
//     currentTask: { reportId: null, assignedAt: null },
//     address: { street: "Sector 11", city: "Varanasi" },
//   },
// ];


