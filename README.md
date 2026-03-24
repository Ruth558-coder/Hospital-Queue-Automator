# Smart Queue Dashboard - Kakamega County Referral Hospital

A comprehensive web-based queue management system designed for hospitals to manage patient queues efficiently. Built with Bootstrap 5 for responsive design and modern UI.

## Features

### Core Functionality
- **Real-time Queue Management** - Add, update, and remove patients from queue
- **Dynamic Status Updates** - Change patient status (Waiting/Serving/Done) with visual feedback
- **Auto-Advance System** - Automatically move next patient to serving when current is done
- **Live Date/Time Display** - Real-time clock in header
- **Data Persistence** - Store queue data using localStorage

### Advanced Features
- **Dual Filtering System** - Filter by service type and status simultaneously
- **Queue Statistics** - Real-time counts for waiting, serving, and completed patients
- **Data Export** - Export queue data as JSON file
- **Bulk Operations** - Clear completed patients with confirmation
- **Visual Status Indicators** - Color-coded cards and badges for clear visibility

### User Interface
- **Responsive Design** - Works on large displays, tablets, and mobile devices
- **Card-based Layout** - Clean, modern patient cards with hover effects
- **Color Coding** - Yellow (Waiting), Blue (Serving), Green (Done)
- **Animations** - Smooth transitions and pulse effects for serving patients
- **Accessibility** - Large, clear text suitable for hospital waiting area displays

## File Structure

```
pressLLB/
├── index.html          # Main HTML structure with Bootstrap components
├── styles.css          # Custom CSS styling and responsive design
├── script.js           # JavaScript functionality and queue management
└── README.md           # This documentation file
```

## Getting Started

1. Open `index.html` in your web browser
2. The system will automatically initialize with empty queue or saved data
3. Add patients using the form on the right side
4. Manage patient queue using the control buttons

## System Requirements

### Part A: HTML Structure (10 Marks) ✅
- **Header Section**: Hospital name and current date/time display
- **Queue Display**: Patient name, service type, queue number, and status
- **Form Section**: Add new patients with service type selection
- **Control Panel**: Buttons to mark patients as serving/done

### Part B: CSS Styling (10 Marks) ✅
- **Modern Hospital Dashboard UI**: Clean, professional design
- **Card-based Design**: Individual patient cards with hover effects
- **Flexbox/Grid Layout**: Responsive Bootstrap grid system
- **Color Coding**: Yellow (Waiting), Blue (Serving), Green (Done)
- **Responsive Design**: Optimized for large displays and tablets
- **Distance Visibility**: Large text and clear visual indicators

### Part C: JavaScript Functionality (15 Marks) ✅
- **Dynamic Queue Management**: Add patients with automatic queue numbering
- **Status Updates**: Change patient status dynamically without page reload
- **Live Clock**: Real-time date and time display updated every second
- **Form Validation**: Prevent empty submissions with visual feedback

### Part D: Advanced Features (5 Marks) ✅
- **Auto-Advance Queue**: Automatically move next patient when current is done
- **Filter by Service Type**: Dropdown to filter patients by service
- **localStorage Storage**: Persistent queue data across browser sessions

## Usage Instructions

### Adding Patients
1. Enter patient name in the "Add New Patient" form
2. Select service type (Consultation, Lab, or Pharmacy)
3. Click "Add to Queue" - patient receives next queue number automatically

### Managing Queue
- **Start Service**: Click "Start" on waiting patients to mark as serving
- **Complete Service**: Click "Complete" on serving patients to mark as done
- **Remove Patient**: Click trash icon to remove patient from queue
- **Auto-Advance**: Enable to automatically move next patient when current completes

### Filtering and Views
- Use status filter buttons to show specific patient categories
- Use service dropdown to filter by service type
- Combine filters for specific views (e.g., Lab patients who are waiting)

### Data Management
- **Export Data**: Download queue data as JSON file for records
- **Clear Completed**: Remove all done patients from queue
- **Statistics**: View real-time counts in the statistics panel

## Technical Implementation

### Bootstrap Components Used
- **Cards**: Patient display with status-based styling
- **Forms**: Patient input with validation
- **Buttons**: Action buttons with icons
- **Badges**: Status and service type indicators
- **Grid System**: Responsive layout
- **Alerts**: Notification system

### JavaScript Architecture
- **QueueManager Class**: Centralized queue management
- **Event Listeners**: Form submissions and button clicks
- **localStorage API**: Data persistence
- **DOM Manipulation**: Dynamic UI updates
- **Validation**: Form input validation
- **Notifications**: User feedback system

### CSS Features
- **Responsive Design**: Mobile-first approach
- **Animations**: Smooth transitions and pulse effects
- **Color Themes**: Status-based color coding
- **Typography**: Large, readable fonts for displays
- **Hover Effects**: Interactive feedback
- **Print Styles**: Optimized for printing queue data

## Browser Compatibility

- **Chrome** 90+
- **Firefox** 88+
- **Safari** 14+
- **Edge** 90+

## Performance Considerations

- **Efficient DOM Updates**: Only update changed elements
- **Event Delegation**: Optimized event handling
- **LocalStorage**: Fast local data access
- **CSS Animations**: Hardware-accelerated transitions
- **Responsive Images**: Optimized for different screen sizes

## Security Features

- **Input Sanitization**: HTML escaping for patient names
- **Form Validation**: Client-side validation before submission
- **Confirmations**: Destructive actions require confirmation
- **Data Validation**: Type checking for localStorage data

## Future Enhancements

- **Multi-user Support**: Multiple staff members managing queues
- **Appointment System**: Scheduled appointments with time slots
- **SMS Notifications**: Patient notifications via SMS
- **Analytics Dashboard**: Queue performance metrics
- **Integration**: Hospital management system integration
- **Voice Announcements**: Audio queue announcements
- **Mobile App**: Dedicated mobile application for staff

## Support

For technical support or feature requests, please refer to the system documentation or contact the development team.
