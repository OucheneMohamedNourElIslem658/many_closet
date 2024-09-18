import 'dart:io';

void main() async {
  final channel = await WebSocket.connect(
    "ws://127.0.0.1:8000/api/v1/notifications/sockets/orders",
    headers: {
      "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkaXNhYmxlZCI6ZmFsc2UsImVtYWlsIjoibV9vdWNoZW5lQGVzdGluLmR6IiwiZW1haWxWZXJpZmllZCI6dHJ1ZSwiZXhwIjoxNzI2NzU0NzY0LCJpZCI6MSwiaXNBZG1pbiI6dHJ1ZX0.d-NOHGqCPUxfnLng8VCLnkI18V2UEoZhgQi2nP1_Y6o"
    }
    );
  channel.listen((data) {
    print(data.toString());
  });
}