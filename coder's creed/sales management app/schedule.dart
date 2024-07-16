import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:sales/main.dart'; // Add this line for date formatting



class ScheduleMeetingPage extends StatefulWidget {
  @override
  _ScheduleMeetingPageState createState() => _ScheduleMeetingPageState();
}

class _ScheduleMeetingPageState extends State<ScheduleMeetingPage> {
  final _formKey = GlobalKey<FormState>();
  TextEditingController _meetingTitleController = TextEditingController();
  TextEditingController _participantController = TextEditingController();
  TextEditingController _notesController = TextEditingController();
  DateTime? _selectedDate;
  TimeOfDay? _selectedTime;

  @override
  void dispose() {
    _meetingTitleController.dispose();
    _participantController.dispose();
    _notesController.dispose();
    super.dispose();
  }

  Future<void> _selectDate(BuildContext context) async {
    final DateTime? picked = await showDatePicker(
      context: context,
      initialDate: DateTime.now(),
      firstDate: DateTime(2000),
      lastDate: DateTime(2101),
    );
    if (picked != null && picked != _selectedDate)
      setState(() {
        _selectedDate = picked;
      });
  }

  Future<void> _selectTime(BuildContext context) async {
    final TimeOfDay? picked = await showTimePicker(
      context: context,
      initialTime: TimeOfDay.now(),
    );
    if (picked != null && picked != _selectedTime)
      setState(() {
        _selectedTime = picked;
      });
  }

  void _scheduleMeeting() {
    if (_formKey.currentState!.validate()) {
      // Get data from input fields
      String meetingTitle = _meetingTitleController.text;
      String participant = _participantController.text;
      String notes = _notesController.text;

      // Ensure date and time are selected
      if (_selectedDate == null || _selectedTime == null) {
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(
          content: Text("Please select both date and time"),
        ));
        return;
      }

      DateTime scheduledDateTime = DateTime(
        _selectedDate!.year,
        _selectedDate!.month,
        _selectedDate!.day,
        _selectedTime!.hour,
        _selectedTime!.minute,
      );

      // TODO: Implement meeting scheduling logic here
      // You might want to:
      // - Create a Meeting object with the collected data.
      // - Send this data to a backend server or API.
      // - Store the meeting details locally (e.g., using shared preferences or a database).

      // For now, just print the entered data
      print('Meeting Title: $meetingTitle');
      print('Participant: $participant');
      print('Notes: $notes');
      print('Scheduled Date and Time: $scheduledDateTime');

      // Optionally, clear the form fields or navigate back after scheduling.
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Schedule Meeting'),
      ),
      body: SingleChildScrollView( // Use SingleChildScrollView to avoid overflow
        padding: EdgeInsets.all(20.0),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: <Widget>[
              TextFormField(
                controller: _meetingTitleController,
                decoration: InputDecoration(
                  labelText: 'Meeting Title',
                  border: OutlineInputBorder(),
                ),
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Please enter the meeting title';
                  }
                  return null;
                },
              ),
              SizedBox(height: 20),
              TextFormField(
                controller: _participantController,
                decoration: InputDecoration(
                  labelText: 'Participant(s)',
                  border: OutlineInputBorder(),
                ),
                // You can add validation here if needed
              ),
              SizedBox(height: 20),
              TextFormField(
                controller: _notesController,
                maxLines: 3,
                decoration: InputDecoration(
                  labelText: 'Notes',
                  border: OutlineInputBorder(),
                ),
                // No validation required for notes
              ),
              SizedBox(height: 20),
              // Date Picker
              Row(
                children: [
                  Expanded(
                    child: ElevatedButton(
                      onPressed: () => _selectDate(context),
                      child: Text('Choose Date'),
                    ),
                  ),
                  SizedBox(width: 20),
                  // Display selected date
                  _selectedDate == null
                      ? Text('No date chosen!')
                      : Text('Date: ${DateFormat.yMd().format(_selectedDate!)}'),
                ],
              ),
              SizedBox(height: 20),
              // Time Picker
              Row(
                children: [
                  Expanded(
                    child: ElevatedButton(
                      onPressed: () => _selectTime(context),
                      child: Text('Choose Time'),
                    ),
                  ),
                  SizedBox(width: 20),
                  // Display selected time
                  _selectedTime == null
                      ? Text('No time chosen!')
                      : Text('Time: ${_selectedTime!.format(context)}'),
                ],
              ),

              SizedBox(height: 30),
              ElevatedButton(
                onPressed: _scheduleMeeting,
                child: Text('Schedule Meeting'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}