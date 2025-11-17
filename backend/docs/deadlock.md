### 1. Deadlock là gì? - Một ví dụ đời thực

Hãy tưởng tượng có hai người, An và Bình, đang ngồi đối diện nhau và cần cả **cây bút** và **cuốn sổ** để viết. Trên bàn chỉ có một cây bút và một cuốn sổ.

1.  **An** nhanh tay chộp lấy **cây bút**.
2.  Cùng lúc đó, **Bình** cũng chộp lấy **cuốn sổ**.
3.  Bây giờ:
    *   An đang giữ cây bút và **chờ** Bình đưa cuốn sổ. An sẽ không nhả cây bút ra cho đến khi có được cuốn sổ.
    *   Bình đang giữ cuốn sổ và **chờ** An đưa cây bút. Bình cũng sẽ không nhả cuốn sổ ra cho đến khi có được cây bút.

Kết quả? Cả hai đều ngồi chờ nhau mãi mãi. Không ai có thể tiếp tục công việc của mình. Đây chính là **Deadlock**.

Trong lập trình, "người" là các **luồng (threads)**, còn "bút" và "sổ" là các **tài nguyên (resources)** như đối tượng, file, kết nối database... mà các luồng cần khóa (lock) để sử dụng.

### 2. Bốn điều kiện cần để xảy ra Deadlock

Deadlock chỉ xảy ra khi **cả bốn điều kiện** sau đây cùng thỏa mãn:

1.  **Mutual Exclusion (Loại trừ lẫn nhau):** Một tài nguyên chỉ có thể được một luồng nắm giữ tại một thời điểm. (Cây bút chỉ có một người cầm được).
2.  **Hold and Wait (Giữ và chờ):** Một luồng đang giữ ít nhất một tài nguyên và đang chờ để được cấp phát tài nguyên khác đang bị luồng khác giữ. (An đang giữ bút và chờ sổ).
3.  **No Preemption (Không thể bị thu hồi):** Một tài nguyên không thể bị lấy lại từ luồng đang giữ nó cho đến khi luồng đó tự nguyện giải phóng. (Không ai có thể giật cây bút từ tay An; An phải tự mình đặt nó xuống).
4.  **Circular Wait (Chờ đợi vòng tròn):** Tồn tại một chuỗi các luồng đang chờ đợi nhau. Luồng A chờ luồng B, luồng B chờ luồng C, ..., và luồng cuối cùng chờ lại luồng A. (An chờ Bình, và Bình lại chờ An).

Phá vỡ chỉ **một** trong bốn điều kiện này sẽ ngăn chặn được Deadlock. Cách phổ biến nhất là phá vỡ điều kiện số 4: **Circular Wait**.

### 3. Ví dụ Code về Deadlock trong Java

Chúng ta sẽ tạo một kịch bản giống hệt ví dụ An và Bình.
- `resource1`: Tượng trưng cho cây bút.
- `resource2`: Tượng trưng cho cuốn sổ.
- `Thread-1`: Tượng trưng cho An.
- `Thread-2`: Tượng trưng cho Bình.

```java
// File: DeadlockExample.java

public class DeadlockExample {

    public static void main(String[] args) {
        // Tạo hai tài nguyên dùng chung
        // Đây là "cây bút" và "cuốn sổ" của chúng ta
        final Object resource1 = new Object();
        final Object resource2 = new Object();

        // Luồng 1 (An): Cố gắng khóa resource1 rồi đến resource2
        Thread thread1 = new Thread(() -> {
            // Sử dụng 'synchronized' để khóa một đối tượng.
            // Khi một luồng vào khối synchronized của một đối tượng, không luồng nào khác có thể vào khối synchronized của CÙNG đối tượng đó.
            synchronized (resource1) {
                System.out.println("Thread 1: Đã khóa resource 1 (cây bút)");

                // Thêm một chút độ trễ để tăng khả năng xảy ra deadlock
                try {
                    Thread.sleep(100);
                } catch (InterruptedException e) {}

                System.out.println("Thread 1: Đang chờ để khóa resource 2 (cuốn sổ)...");

                // Cố gắng khóa resource2, nhưng resource2 có thể đã bị Thread 2 khóa
                synchronized (resource2) {
                    System.out.println("Thread 1: Đã khóa resource 1 VÀ resource 2");
                }
            }
        }, "Thread-An"); // Đặt tên cho luồng để dễ debug

        // Luồng 2 (Bình): Cố gắng khóa resource2 rồi đến resource1 (NGƯỢC LẠI với Luồng 1)
        Thread thread2 = new Thread(() -> {
            synchronized (resource2) {
                System.out.println("Thread 2: Đã khóa resource 2 (cuốn sổ)");

                try {
                    Thread.sleep(100);
                } catch (InterruptedException e) {}

                System.out.println("Thread 2: Đang chờ để khóa resource 1 (cây bút)...");

                // Cố gắng khóa resource1, nhưng resource1 có thể đã bị Thread 1 khóa
                synchronized (resource1) {
                    System.out.println("Thread 2: Đã khóa resource 1 VÀ resource 2");
                }
            }
        }, "Thread-Binh");

        // Bắt đầu chạy cả hai luồng
        thread1.start();
        thread2.start();
        
        System.out.println("Main thread: Đã khởi động 2 luồng. Chương trình có thể sẽ bị treo ở đây.");
    }
}
```

#### Phân tích kết quả khi chạy

Khi bạn chạy đoạn code trên, rất có thể bạn sẽ thấy output dừng lại ở đây và chương trình bị treo vô thời hạn:

```
Main thread: Đã khởi động 2 luồng. Chương trình có thể sẽ bị treo ở đây.
Thread 1: Đã khóa resource 1 (cây bút)
Thread 2: Đã khóa resource 2 (cuốn sổ)
Thread 1: Đang chờ để khóa resource 2 (cuốn sổ)...
Thread 2: Đang chờ để khóa resource 1 (cây bút)...
// <CHƯƠNG TRÌNH TREO Ở ĐÂY>
```

**Tại sao lại treo?**
1.  `Thread 1` chạy, khóa `resource1`.
2.  Hệ điều hành chuyển sang cho `Thread 2` chạy.
3.  `Thread 2` chạy, khóa `resource2`.
4.  `Thread 1` chạy lại, cố gắng khóa `resource2` nhưng không thể vì `Thread 2` đang giữ nó. `Thread 1` rơi vào trạng thái chờ.
5.  `Thread 2` chạy lại, cố gắng khóa `resource1` nhưng không thể vì `Thread 1` đang giữ nó. `Thread 2` cũng rơi vào trạng thái chờ.
6.  Cả hai luồng đều chờ nhau -> **Deadlock!**

### 4. Cách giải quyết Deadlock: Phá vỡ Circular Wait

Cách đơn giản và hiệu quả nhất là **đảm bảo tất cả các luồng đều yêu cầu khóa theo cùng một thứ tự**.

Nếu cả An và Bình đều có quy tắc "phải lấy cây bút trước, sau đó mới được lấy cuốn sổ", thì deadlock sẽ không xảy ra. Người nào lấy được bút trước sẽ lấy được sổ, làm xong việc rồi trả cả hai. Người còn lại sẽ phải đợi.

Hãy sửa lại `Thread 2` để nó cũng khóa `resource1` trước, `resource2` sau.

```java
// File: DeadlockSolution.java

public class DeadlockSolution {

    public static void main(String[] args) {
        final Object resource1 = new Object();
        final Object resource2 = new Object();

        // Luồng 1: Khóa resource1 -> resource2
        Thread thread1 = new Thread(() -> {
            synchronized (resource1) {
                System.out.println("Thread 1: Đã khóa resource 1");
                try { Thread.sleep(100); } catch (InterruptedException e) {}
                System.out.println("Thread 1: Đang chờ khóa resource 2...");
                synchronized (resource2) {
                    System.out.println("Thread 1: Đã khóa resource 1 và 2 - HOÀN THÀNH");
                }
            }
        });

        // Luồng 2: Sửa lại để cũng khóa theo thứ tự resource1 -> resource2
        Thread thread2 = new Thread(() -> {
            // ĐẢM BẢO KHÓA THEO CÙNG THỨ TỰ
            synchronized (resource1) {
                System.out.println("Thread 2: Đã khóa resource 1");
                try { Thread.sleep(100); } catch (InterruptedException e) {}
                System.out.println("Thread 2: Đang chờ khóa resource 2...");
                synchronized (resource2) {
                    System.out.println("Thread 2: Đã khóa resource 1 và 2 - HOÀN THÀNH");
                }
            }
        });

        thread1.start();
        thread2.start();
    }
}
```

Bây giờ, chương trình sẽ luôn chạy đến cùng và kết thúc mà không bị treo, vì không thể xảy ra chờ đợi vòng tròn nữa. Một luồng sẽ lấy được `resource1`, sau đó lấy `resource2`, hoàn thành công việc, rồi nhả khóa cho luồng kia.