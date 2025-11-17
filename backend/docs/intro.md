# Tổng Quan về Java Thread

## 1. Thread là gì?

Trong Java, một **Thread** (luồng) là một đơn vị thực thi nhỏ nhất trong một chương trình. Một ứng dụng có thể có nhiều luồng chạy song song, mỗi luồng thực hiện một công việc riêng. Việc này được gọi là **đa luồng (multithreading)**.

**Ví dụ đời thực:** Hãy tưởng tượng một nhà hàng.
- **Tiến trình (Process)** là toàn bộ nhà hàng.
- **Luồng (Thread)** là mỗi người đầu bếp. Nhiều đầu bếp có thể làm việc cùng lúc (nấu ăn, rửa rau, thái thịt) để nhà hàng phục vụ khách nhanh hơn.

**Lợi ích của đa luồng:**
- Tăng hiệu năng của ứng dụng bằng cách tận dụng CPU đa nhân.
- Giúp ứng dụng không bị "đơ" (non-blocking), đặc biệt là các ứng dụng có giao diện người dùng (GUI).
- Cho phép thực hiện các tác vụ nền (background tasks) như tải file, xử lý dữ liệu.

## 2. Cách tạo một Thread

Có hai cách chính để tạo một luồng trong Java:

### Cách 1: Kế thừa (Extend) lớp `Thread`

1.  Tạo một class kế thừa từ `java.lang.Thread`.
2.  Ghi đè (override) phương thức `run()`. Logic của luồng sẽ được viết trong phương thức này.
3.  Tạo một đối tượng của class đó và gọi phương thức `start()` để bắt đầu luồng.

```java
class MyThread extends Thread {
    @Override
    public void run() {
        for (int i = 0; i < 5; i++) {
            System.out.println("Thread kế thừa: " + i);
            try {
                Thread.sleep(500); // Tạm dừng 500ms
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
    }
}
```

### Cách 2: Implement interface `Runnable` (Khuyến khích)

1.  Tạo một class implement `java.lang.Runnable`.
2.  Implement phương thức `run()`.
3.  Tạo một đối tượng của class đó, sau đó tạo một đối tượng `Thread` mới và truyền đối tượng `Runnable` vào constructor.
4.  Gọi phương thức `start()` trên đối tượng `Thread`.

```java
class MyRunnable implements Runnable {
    @Override
    public void run() {
        for (int i = 0; i < 5; i++) {
            System.out.println("Thread từ Runnable: " + i);
            try {
                Thread.sleep(500);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
    }
}
```

**Tại sao nên dùng `Runnable`?**
- Java không hỗ trợ đa kế thừa. Nếu class của bạn đã kế thừa một class khác, bạn không thể kế thừa `Thread` được nữa, nhưng vẫn có thể implement `Runnable`.
- Nó giúp tách biệt giữa "nhiệm vụ cần làm" (`Runnable`) và "cách thực thi nhiệm vụ đó" (`Thread`). Đây là một thiết kế tốt hơn.

## 3. Vòng Đời của một Thread

Một luồng có các trạng thái sau:
- **NEW:** Luồng vừa được tạo nhưng chưa được gọi `start()`.
- **RUNNABLE:** Luồng đã sẵn sàng để chạy và đang chờ CPU cấp phát thời gian.
- **BLOCKED:** Luồng đang bị chặn, chờ một monitor lock (ví dụ, chờ để vào một khối `synchronized`).
- **WAITING:** Luồng đang chờ một luồng khác thực hiện một hành động cụ thể (ví dụ, chờ `object.wait()` hoặc `thread.join()`).
- **TIMED_WAITING:** Tương tự `WAITING`, nhưng có thời gian chờ tối đa (ví dụ `Thread.sleep(1000)`).
- **TERMINATED:** Luồng đã hoàn thành công việc trong phương thức `run()` và đã kết thúc.

## 4. Vấn đề thường gặp: Race Condition

Đây là vấn đề xảy ra khi nhiều luồng cùng truy cập và thay đổi một tài nguyên dùng chung (shared resource), dẫn đến kết quả không thể đoán trước và thường là sai.

**Ví dụ:** Hai luồng cùng tăng một biến đếm.

```java
// Lớp đếm không an toàn
class Counter {
    private int count = 0;

    public void increment() {
        count++; // Thao tác này không an toàn! (gồm 3 bước: đọc, tăng, ghi)
    }

    public int getCount() {
        return count;
    }
}
```
Nếu hai luồng cùng gọi `increment()` gần như đồng thời, chúng có thể cùng đọc giá trị cũ, cùng tăng lên, và cùng ghi lại giá trị mới. Kết quả là biến đếm chỉ tăng 1 thay vì 2.

**Giải pháp:** Sử dụng từ khóa `synchronized` để đảm bảo tại một thời điểm chỉ có một luồng được phép thực thi phương thức đó.

```java
class SafeCounter {
    private int count = 0;

    // Chỉ một luồng được vào đây tại một thời điểm
    public synchronized void increment() {
        count++;
    }

    public int getCount() {
        return count;
    }
}
```

## 5. Ví dụ Code tổng hợp

File `Main.java`

```java
public class Main {

    public static void main(String[] args) throws InterruptedException {
        System.out.println("=== Ví dụ 1 & 2: Tạo Thread ===");

        // Cách 1: Kế thừa Thread
        MyThread myThread = new MyThread();
        myThread.start();

        // Cách 2: Implement Runnable
        MyRunnable myRunnable = new MyRunnable();
        Thread runnableThread = new Thread(myRunnable);
        runnableThread.start();

        // Chờ 2 luồng trên kết thúc trước khi tiếp tục
        myThread.join();
        runnableThread.join();

        System.out.println("\n=== Ví dụ 3: Race Condition ===");
        runRaceConditionDemo();
    }

    public static void runRaceConditionDemo() throws InterruptedException {
        Counter unsafeCounter = new Counter();
        SafeCounter safeCounter = new SafeCounter();

        // --- Demo với Counter không an toàn ---
        Thread t1 = new Thread(() -> {
            for (int i = 0; i < 10000; i++) {
                unsafeCounter.increment();
            }
        });

        Thread t2 = new Thread(() -> {
            for (int i = 0; i < 10000; i++) {
                unsafeCounter.increment();
            }
        });

        t1.start();
        t2.start();
        t1.join();
        t2.join();
        
        System.out.println("Kết quả của Counter không an toàn: " + unsafeCounter.getCount());
        System.out.println("(Thường sẽ < 20000 do Race Condition)");

        // --- Demo với Counter an toàn ---
        Thread t3 = new Thread(() -> {
            for (int i = 0; i < 10000; i++) {
                safeCounter.increment();
            }
        });

        Thread t4 = new Thread(() -> {
            for (int i = 0; i < 10000; i++) {
                safeCounter.increment();
            }
        });

        t3.start();
        t4.start();
        t3.join();
        t4.join();

        System.out.println("Kết quả của Counter an toàn: " + safeCounter.getCount());
        System.out.println("(Luôn luôn là 20000)");
    }
}

// ----- Các class đã định nghĩa ở trên -----

class MyThread extends Thread {
    @Override
    public void run() {
        for (int i = 0; i < 5; i++) {
            System.out.println(Thread.currentThread().getName() + " - Thread kế thừa: " + i);
            try {
                Thread.sleep(500);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
    }
}

class MyRunnable implements Runnable {
    @Override
    public void run() {
        for (int i = 0; i < 5; i++) {
            System.out.println(Thread.currentThread().getName() + " - Thread từ Runnable: " + i);
            try {
                Thread.sleep(500);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
    }
}

class Counter {
    private int count = 0;
    public void increment() { count++; }
    public int getCount() { return count; }
}

class SafeCounter {
    private int count = 0;
    public synchronized void increment() { count++; }
    public int getCount() { return count; }
}
```

## 6. Lời khuyên

- Ưu tiên sử dụng `Runnable` thay vì kế thừa `Thread`.
- Cẩn thận khi các luồng chia sẻ dữ liệu. Sử dụng `synchronized` hoặc các cơ chế khóa khác (`Lock`, `ReentrantLock`) để tránh Race Condition.
- Trong các ứng dụng hiện đại, hãy xem xét sử dụng **ExecutorService Framework** (`java.util.concurrent`) để quản lý luồng một cách hiệu quả và dễ dàng hơn thay vì tự tạo và quản lý `Thread` thủ công.