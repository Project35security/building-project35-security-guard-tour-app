
# Project35 Security Guard Tour App

## Requirements

### Core Features
- **User Authentication & Authorization**: Multi-role system (guards, supervisors, admin, clients)
- **Security Operations**: Patrol checkpoints, incident reports, panic alerts, inspections
- **Shift Management**: 3-shift system (6am-2pm, 2pm-10pm, 10pm-6am), attendance tracking
- **Administration**: Employee management, work orders, asset control, compliance
- **Sales & Finance**: Leaderboards, pipeline, quotations, billing, payroll
- **Communication**: Messaging, shift handover, announcements, WhatsApp integration
- **Reporting**: Audit reports, checklists, site attendance, shift logs

### Technical Requirements
- React + TypeScript frontend with shadcn/ui components
- Supabase backend for database and authentication
- Real-time features for alerts and messaging
- Mobile-responsive design for field operations
- Role-based access control (RBAC)

## Design

### User Roles & Permissions
- **Super Admin**: Full system access
- **Admin**: Company management, reports, billing
- **Supervisor**: Team management, scheduling, operations
- **Guard**: Patrol duties, incident reporting, time tracking
- **Client**: View reports, service requests, account management

### Database Schema
- Users (authentication, roles, profiles)
- Sites (client locations, checkpoints)
- Shifts (schedules, assignments, logs)
- Patrols (routes, checkpoints, completions)
- Incidents (reports, alerts, responses)
- Work Orders (maintenance, requests, status)
- Financial (billing, payroll, quotations)

### UI/UX Design
- Professional security-themed design with Project35 branding
- Dashboard-centric layout with role-specific views
- Mobile-first approach for field operations
- Real-time notifications and alerts
- Quick action buttons for emergency situations

## Tasks

### Phase 1: Foundation & Authentication (2,500 LOC)
1. **Project Setup & Design System** (300 LOC)
   - Initialize design tokens with security theme colors
   - Create base layout components
   - Implement Project35 branding

2. **Authentication System** (800 LOC)
   - Multi-role user authentication
   - Role-based route protection
   - User profile management
   - Password reset functionality

3. **Core Navigation** (400 LOC)
   - Role-specific sidebar navigation
   - Dashboard layouts for each user type
   - Responsive mobile navigation

4. **Database Schema Setup** (1,000 LOC)
   - User management tables
   - Sites and locations
   - Basic security operations tables
   - Row-level security policies

### Phase 2: Security Operations Core (3,000 LOC)
1. **Patrol Management** (1,200 LOC)
   - Checkpoint creation and management
   - Patrol route planning
   - Real-time patrol tracking
   - Patrol completion verification

2. **Incident Reporting** (800 LOC)
   - Incident report forms
   - Photo/video attachments
   - Severity classification
   - Real-time alert system

3. **Emergency Features** (600 LOC)
   - Panic button functionality
   - Emergency alert broadcasting
   - GPS location tracking
   - Emergency contact system

4. **Inspection System** (400 LOC)
   - Inspection checklists
   - Site inspection forms
   - Compliance tracking
   - Audit trail generation

### Phase 3: Shift & Time Management (2,500 LOC)
1. **Shift Scheduling** (1,000 LOC)
   - 3-shift system (6am-2pm, 2pm-10pm, 10pm-6am)
   - Guard availability calendar
   - Shift assignment management
   - One-off day scheduling

2. **Time & Attendance** (800 LOC)
   - Clock in/out system
   - Overtime tracking
   - Attendance reports
   - Late/absence management

3. **Shift Handover** (700 LOC)
   - Shift log creation
   - Handover notes system
   - Status updates
   - Equipment transfer logs

### Phase 4: Administration & Management (2,000 LOC)
1. **Employee Management** (600 LOC)
   - Employee profiles
   - Training records
   - Performance tracking
   - Document management

2. **Work Orders** (500 LOC)
   - Service request system
   - Work order tracking
   - Asset control
   - Maintenance scheduling

3. **Client Management** (500 LOC)
   - Client profiles
   - Account information
   - Service agreements
   - Communication logs

4. **Compliance & Auditing** (400 LOC)
   - Compliance checklists
   - Audit report generation
   - Regulatory tracking
   - Documentation system

### Phase 5: Sales & Finance (2,000 LOC)
1. **Sales Management** (800 LOC)
   - Sales pipeline tracking
   - Quotation system
   - Lead management
   - Sales leaderboard

2. **Financial Operations** (700 LOC)
   - Billing system
   - Invoice generation
   - Payment tracking
   - Financial reporting

3. **Payroll System** (500 LOC)
   - Payroll calculation
   - Overtime computation
   - Deduction management
   - Payslip generation

### Phase 6: Communication & Integration (1,500 LOC)
1. **Messaging System** (600 LOC)
   - Internal messaging
   - Announcement system
   - Notification management
   - Message history

2. **WhatsApp Integration** (500 LOC)
   - WhatsApp API integration
   - Automated notifications
   - Status updates
   - Emergency alerts

3. **Reporting Dashboard** (400 LOC)
   - Real-time analytics
   - Performance metrics
   - Custom report builder
   - Data visualization

## Discussions

### Technical Considerations
- **Database Design**: Complex relational structure requiring careful planning for performance
- **Real-time Features**: WebSocket connections for live updates and emergency alerts
- **Mobile Optimization**: Critical for field operations and guard usability
- **Security**: Enhanced security measures for sensitive security operations data
- **Scalability**: Multi-tenant architecture for multiple security companies

### Implementation Strategy
- Start with core authentication and basic operations
- Build incrementally with user feedback
- Prioritize mobile experience for guards
- Implement real-time features early for emergency scenarios
- Focus on data integrity and audit trails

### Integration Requirements
- WhatsApp Business API for external communications
- GPS/location services for patrol tracking
- Camera/photo upload for incident reporting
- Push notifications for alerts and updates
- Potential integration with security hardware (future)