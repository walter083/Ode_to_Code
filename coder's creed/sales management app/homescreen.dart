import 'package:flutter/material.dart';
import 'package:sales/dataentry.dart';
import 'package:sales/schedule.dart';



class HomePage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Sales Management'),
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(
              'Welcome to the Sales Management App',
              style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
            ),
            SizedBox(height: 50),
            _buildIconGrid(context),
          ],
        ),
      ),
    );
  }

  Widget _buildIconGrid(BuildContext context) {
    return GridView.count(
      crossAxisCount: 3,
      shrinkWrap: true,
      mainAxisSpacing: 20,
      crossAxisSpacing: 20,
      padding: EdgeInsets.all(20),
      children: [
        _buildIconButton(context, 'Data Entry', Icons.input, () {
          // Navigate to data entry screen
          // TODO: Implement navigation logic
          Navigator.push(
    context,
    MaterialPageRoute(
        builder: (context) => DataEntryPage()),
);
          _showSnackBar(context, 'Data Entry');
        }),
        _buildIconButton(context, 'Schedule Meeting', Icons.calendar_today, () {
          Navigator.push(
    context,
    MaterialPageRoute(
        builder: (context) => ScheduleMeetingPage()),
);
          // Navigate to schedule meeting screen
          // TODO: Implement navigation logic
          _showSnackBar(context, 'Schedule Meeting');
        }),
        _buildIconButton(context, 'Inquiries', Icons.question_answer, () {
          // Navigate to inquiries screen
          // TODO: Implement navigation logic
          _showSnackBar(context, 'Inquiries');
        }),
      ],
    );
  }

  Widget _buildIconButton(BuildContext context, String label, IconData icon, VoidCallback onPressed) {
    return Column(
      children: [
        ElevatedButton(
          onPressed: onPressed,
          style: ElevatedButton.styleFrom(
            shape: CircleBorder(), backgroundColor: Color.fromARGB(255, 26, 59, 248),
            padding: EdgeInsets.all(24), // Customize button color
          ),
          child: Icon(icon, size: 32, color: Color.fromARGB(255, 218, 218, 232)),
        ),
        SizedBox(height: 10),
        Text(label),
      ],
    );
  }

  void _showSnackBar(BuildContext context, String message) {
    ScaffoldMessenger.of(context).showSnackBar(SnackBar(
      content: Text(message),
      duration: Duration(seconds: 1),
    ));
  }
}