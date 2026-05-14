const workoutDatabase = {
  Chest: {
    Beginner: {
      home: [
        {
          name: "Knee Push Up",
          level: "Beginner",
          target: "Middle Chest",
          sets: "3",
          reps: "12-15",
          equipment: "Bodyweight",
          description:
            "Phiên bản chống đẩy dễ hơn dành cho người mới.",
          video: "https://www.youtube.com/embed/SR__amDl1c8",
        },

        {
          name: "Wall Push Up",
          level: "Beginner",
          target: "Middle Chest",
          sets: "3",
          reps: "15",
          equipment: "Bodyweight",
          description:
            "Phù hợp cho người quá yếu hoặc overweight.",
          video: "",
        },

        {
          name: "Incline Push Up",
          level: "Beginner",
          target: "Middle Chest",
          sets: "3",
          reps: "10-12",
          equipment: "Bodyweight",
          description:
            "Chống đẩy với tay đặt cao giúp giảm áp lực.",
          video: "",
        },
      ],

      gym: [
        {
          name: "Machine Chest Press",
          level: "Beginner",
          target: "Middle Chest",
          sets: "3",
          reps: "10-12",
          equipment: "Machine",
          description:
            "Bài tập máy giúp người mới dễ kiểm soát chuyển động.",
          video: "",
        },

        {
          name: "Incline Machine Press",
          level: "Beginner",
          target: "Upper Chest",
          sets: "3",
          reps: "10-12",
          equipment: "Machine",
          description:
            "Tập trung phát triển ngực trên.",
          video: "",
        },

        {
          name: "Pec Deck Fly",
          level: "Beginner",
          target: "Inner Chest",
          sets: "3",
          reps: "12-15",
          equipment: "Machine",
          description:
            "Bài ép ngực giúp cảm nhận cơ tốt cho người mới.",
          video: "",
        },
      ],
    },

    Intermediate: {
      home: [
        {
          name: "Standard Push Up",
          level: "Intermediate",
          target: "Middle Chest",
          sets: "4",
          reps: "15-20",
          equipment: "Bodyweight",
          description:
            "Bài nền tảng tốt nhất khi tập ngực tại nhà.",
          video: "",
        },

        {
          name: "Decline Push Up",
          level: "Intermediate",
          target: "Upper Chest",
          sets: "4",
          reps: "10-15",
          equipment: "Bodyweight",
          description:
            "Đặt chân cao để tăng áp lực lên ngực trên.",
          video: "",
        },
      ],

      gym: [
        {
          name: "Barbell Bench Press",
          level: "Intermediate",
          target: "Middle Chest",
          sets: "4",
          reps: "6-10",
          equipment: "Barbell",
          description:
            "Bài compound quan trọng nhất cho phát triển cơ ngực.",
          video: "",
        },

        {
          name: "Incline Dumbbell Press",
          level: "Intermediate",
          target: "Upper Chest",
          sets: "4",
          reps: "8-12",
          equipment: "Dumbbell",
          description:
            "Tăng độ dày ngực trên.",
          video: "",
        },

        {
          name: "Cable Fly",
          level: "Intermediate",
          target: "Inner Chest",
          sets: "3",
          reps: "12-15",
          equipment: "Cable",
          description:
            "Giữ tension liên tục lên cơ ngực.",
          video: "",
        },
      ],
    },

    Advanced: {
      home: [
        {
          name: "Clap Push Up",
          level: "Advanced",
          target: "Middle Chest",
          sets: "4",
          reps: "8-12",
          equipment: "Bodyweight",
          description:
            "Bài explosive tăng sức mạnh thân trên.",
          video: "",
        },

        {
          name: "One Arm Push Up",
          level: "Advanced",
          target: "Chest + Core",
          sets: "3",
          reps: "3-6",
          equipment: "Bodyweight",
          description:
            "Bodyweight advanced movement cực khó.",
          video: "",
        },
      ],

      gym: [
        {
          name: "Incline Barbell Press",
          level: "Advanced",
          target: "Upper Chest",
          sets: "5",
          reps: "5-8",
          equipment: "Barbell",
          description:
            "Bài ngực trên nâng cao cho hypertrophy và strength.",
          video: "",
        },

        {
          name: "Weighted Dips",
          level: "Advanced",
          target: "Lower Chest",
          sets: "4",
          reps: "6-10",
          equipment: "Dip Bar + Weight",
          description:
            "Dips có thêm tạ giúp build lower chest cực mạnh.",
          video: "",
        },
      ],
    },
  },

  Shoulder: {
    Beginner: {
      home: [
        {
          name: "Pike Push Up",
          level: "Beginner",
          target: "Shoulders",
          sets: "3",
          reps: "8-12",
          equipment: "Bodyweight",
          description:
            "Bài chống đẩy kiểu pike giúp tập vai tại nhà.",
          video: "",
        },

        {
          name: "Wall Shoulder Tap",
          level: "Beginner",
          target: "Shoulders + Core",
          sets: "3",
          reps: "10-12",
          equipment: "Bodyweight",
          description:
            "Cải thiện độ ổn định vai và core.",
          video: "",
        },
      ],

      gym: [
        {
          name: "Machine Shoulder Press",
          level: "Beginner",
          target: "Front Delts + Side Delts",
          sets: "3",
          reps: "10-12",
          equipment: "Machine",
          description:
            "Đẩy vai bằng máy cho người mới.",
          video: "",
        },

        {
          name: "Dumbbell Shoulder Press",
          level: "Beginner",
          target: "Front Delts + Side Delts",
          sets: "3",
          reps: "10-12",
          equipment: "Dumbbell",
          description:
            "Bài đẩy vai với tạ đơn.",
          video: "",
        },
      ],
    },

    Intermediate: {
      home: [
        {
          name: "Decline Pike Push Up",
          level: "Intermediate",
          target: "Shoulders",
          sets: "4",
          reps: "8-12",
          equipment: "Bodyweight",
          description:
            "Phiên bản khó hơn của pike push up.",
          video: "",
        },
      ],

      gym: [
        {
          name: "Barbell Overhead Press",
          level: "Intermediate",
          target: "Full Shoulders",
          sets: "4",
          reps: "6-10",
          equipment: "Barbell",
          description:
            "Compound quan trọng cho vai.",
          video: "",
        },

        {
          name: "Arnold Press",
          level: "Intermediate",
          target: "Full Shoulders",
          sets: "4",
          reps: "8-10",
          equipment: "Dumbbell",
          description:
            "Vai hoạt động qua biên độ rộng hơn.",
          video: "",
        },
      ],
    },

    Advanced: {
      home: [],

      gym: [
        {
          name: "Push Press",
          level: "Advanced",
          target: "Shoulders + Power",
          sets: "5",
          reps: "4-6",
          equipment: "Barbell",
          description:
            "Đẩy vai với hỗ trợ lực từ chân.",
          video: "",
        },

        {
          name: "Rear Delt Fly",
          level: "Advanced",
          target: "Rear Delts",
          sets: "4",
          reps: "12-15",
          equipment: "Dumbbell",
          description:
            "Cô lập vai sau.",
          video: "",
        },
      ],
    },
  },

  Biceps: {
    Beginner: {
      home: [
        {
          name: "Backpack Curl",
          level: "Beginner",
          target: "Biceps",
          sets: "3",
          reps: "12-15",
          equipment: "Backpack",
          description:
            "Cuốn tay bằng balo.",
          video: "",
        },
      ],

      gym: [
        {
          name: "Dumbbell Curl",
          level: "Beginner",
          target: "Biceps",
          sets: "3",
          reps: "10-12",
          equipment: "Dumbbell",
          description:
            "Cuốn tay cơ bản cho người mới.",
          video: "",
        },

        {
          name: "Cable Curl",
          level: "Beginner",
          target: "Biceps",
          sets: "3",
          reps: "12",
          equipment: "Cable",
          description:
            "Cuốn tay bằng cáp.",
          video: "",
        },
      ],
    },

    Intermediate: {
      home: [],

      gym: [
        {
          name: "Barbell Curl",
          level: "Intermediate",
          target: "Biceps",
          sets: "4",
          reps: "8-10",
          equipment: "Barbell",
          description:
            "Biceps cổ điển.",
          video: "",
        },

        {
          name: "Hammer Curl",
          level: "Intermediate",
          target: "Biceps + Forearms",
          sets: "3",
          reps: "10-12",
          equipment: "Dumbbell",
          description:
            "Giúp tay dày hơn.",
          video: "",
        },
      ],
    },

    Advanced: {
      home: [],

      gym: [
        {
          name: "Spider Curl",
          level: "Advanced",
          target: "Biceps",
          sets: "4",
          reps: "10",
          equipment: "Dumbbell",
          description:
            "Giữ biceps dưới áp lực liên tục.",
          video: "",
        },
      ],
    },
  },

  Triceps: {
    Beginner: {
      home: [
        {
          name: "Bench Dip",
          level: "Beginner",
          target: "Triceps",
          sets: "3",
          reps: "10-12",
          equipment: "Chair",
          description:
            "Dip với ghế tại nhà.",
          video: "",
        },
      ],

      gym: [
        {
          name: "Tricep Pushdown",
          level: "Beginner",
          target: "Triceps",
          sets: "3",
          reps: "12",
          equipment: "Cable",
          description:
            "Kéo cáp tay sau phổ biến.",
          video: "",
        },
      ],
    },

    Intermediate: {
      home: [],

      gym: [
        {
          name: "Skull Crusher",
          level: "Intermediate",
          target: "Triceps Long Head",
          sets: "4",
          reps: "8-10",
          equipment: "EZ Bar",
          description:
            "Nằm duỗi tay sau.",
          video: "",
        },
      ],
    },

    Advanced: {
      home: [],

      gym: [
        {
          name: "Weighted Dips",
          level: "Advanced",
          target: "Triceps + Lower Chest",
          sets: "4",
          reps: "6-10",
          equipment: "Dip Bar",
          description:
            "Dips thêm tạ.",
          video: "",
        },
      ],
    },
  },

  Legs: {
    Beginner: {
      home: [
        {
          name: "Bodyweight Squat",
          level: "Beginner",
          target: "Quads + Glutes",
          sets: "3",
          reps: "15",
          equipment: "Bodyweight",
          description:
            "Squat không tạ cho người mới.",
          video: "",
        },
      ],

      gym: [
        {
          name: "Leg Press",
          level: "Beginner",
          target: "Quads + Glutes",
          sets: "3",
          reps: "10-12",
          equipment: "Machine",
          description:
            "Đạp chân bằng máy.",
          video: "",
        },
      ],
    },

    Intermediate: {
      home: [],

      gym: [
        {
          name: "Barbell Squat",
          level: "Intermediate",
          target: "Quads + Glutes",
          sets: "4",
          reps: "6-10",
          equipment: "Barbell",
          description:
            "Compound quan trọng nhất cho chân.",
          video: "",
        },

        {
          name: "Romanian Deadlift",
          level: "Intermediate",
          target: "Hamstrings + Glutes",
          sets: "4",
          reps: "8-10",
          equipment: "Barbell",
          description:
            "Tập trung vào đùi sau và mông.",
          video: "",
        },
      ],
    },

    Advanced: {
      home: [
        {
          name: "Pistol Squat",
          level: "Advanced",
          target: "Quads + Balance",
          sets: "3",
          reps: "5-8",
          equipment: "Bodyweight",
          description:
            "Squat một chân nâng cao.",
          video: "",
        },
      ],

      gym: [
        {
          name: "Front Squat",
          level: "Advanced",
          target: "Quads + Core",
          sets: "5",
          reps: "5-8",
          equipment: "Barbell",
          description:
            "Squat đặt tạ phía trước.",
          video: "",
        },
      ],
    },
  },

  Abs: {
    Beginner: {
      home: [
        {
          name: "Crunch",
          level: "Beginner",
          target: "Upper Abs",
          sets: "3",
          reps: "15",
          equipment: "Bodyweight",
          description:
            "Gập bụng cơ bản.",
          video: "",
        },

        {
          name: "Plank",
          level: "Beginner",
          target: "Core",
          sets: "3",
          reps: "30-60 sec",
          equipment: "Bodyweight",
          description:
            "Giữ plank tăng core.",
          video: "",
        },
      ],

      gym: [],
    },

    Intermediate: {
      home: [],

      gym: [
        {
          name: "Cable Crunch",
          level: "Intermediate",
          target: "Abs",
          sets: "4",
          reps: "12-15",
          equipment: "Cable",
          description:
            "Gập bụng với cáp.",
          video: "",
        },
      ],
    },

    Advanced: {
      home: [],

      gym: [
        {
          name: "Dragon Flag",
          level: "Advanced",
          target: "Full Core",
          sets: "4",
          reps: "5-8",
          equipment: "Bench",
          description:
            "Core nâng cao.",
          video: "",
        },
      ],
    },
  },

  Cardio: {
    Beginner: {
      home: [
        {
          name: "Brisk Walking",
          level: "Beginner",
          target: "Fat Loss",
          duration: "30-45 min",
          equipment: "None",
          description:
            "Đi bộ nhanh giảm mỡ.",
          video: "",
        },
      ],

      gym: [
        {
          name: "Incline Walking",
          level: "Beginner",
          target: "Fat Loss + Heart Health",
          duration: "20-30 min",
          equipment: "Treadmill",
          description:
            "Đi bộ dốc cardio cường độ thấp.",
          video: "",
        },
      ],
    },

    Intermediate: {
      home: [],

      gym: [
        {
          name: "Rowing Machine",
          level: "Intermediate",
          target: "Full Body Cardio",
          duration: "15-20 min",
          equipment: "Rowing Machine",
          description:
            "Cardio toàn thân.",
          video: "",
        },
      ],
    },

    Advanced: {
      home: [
        {
          name: "Burpee Circuit",
          level: "Advanced",
          target: "Full Body Cardio",
          sets: "4",
          reps: "12-15",
          equipment: "Bodyweight",
          description:
            "Burpee tăng nhịp tim nhanh.",
          video: "",
        },
      ],

      gym: [
        {
          name: "Assault Bike",
          level: "Advanced",
          target: "HIIT Conditioning",
          duration: "10-15 min",
          equipment: "Assault Bike",
          description:
            "Cardio cường độ rất cao.",
          video: "",
        },
      ],
    },
  },
};

export default workoutDatabase;