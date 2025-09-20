import "server-only";

import { prisma } from "@/lib/db";
import { requireAdmin } from "./require-admin";

// Type definitions for the analytics data
interface LessonProgress {
  completed: boolean;
}

interface Lesson {
  id: string;
  lessonProgress: LessonProgress[];
}

interface Chapter {
  lessons: Lesson[];
}

interface Course {
  id: string;
  title: string;
  chapter: Chapter[];
}

interface Enrollment {
  Course: Course;
}

interface UserWithEnrollments {
  id: string;
  name: string | null;
  email: string;
  enrollment: Enrollment[];
}

export async function adminGetCourseCompletionStats() {
  await requireAdmin();

  // Get course completion data
  const courseCompletionData = await prisma.course.findMany({
    select: {
      id: true,
      title: true,
      chapter: {
        select: {
          lessons: {
            select: {
              id: true,
              lessonProgress: {
                select: {
                  completed: true,
                },
              },
            },
          },
        },
      },
      enrollment: {
        select: {
          userId: true,
        },
      },
    },
  });

  // Calculate completion rates for each course
  const courseStats = courseCompletionData.map((course) => {
    const totalLessons = course.chapter.reduce(
      (acc, chapter) => acc + chapter.lessons.length,
      0
    );
    
    const totalEnrollments = course.enrollment.length;
    
    // Count completed lessons across all users for this course
    const completedLessons = course.chapter.reduce((acc, chapter) => {
      return acc + chapter.lessons.reduce((lessonAcc, lesson) => {
        return lessonAcc + lesson.lessonProgress.filter(progress => progress.completed).length;
      }, 0);
    }, 0);

    // Calculate completion rate
    const completionRate = totalLessons > 0 && totalEnrollments > 0 
      ? (completedLessons / (totalLessons * totalEnrollments)) * 100 
      : 0;

    return {
      courseId: course.id,
      courseTitle: course.title,
      totalLessons,
      totalEnrollments,
      completedLessons,
      completionRate: Math.round(completionRate * 100) / 100, // Round to 2 decimal places
    };
  });

  return courseStats;
}

export async function adminGetUserProgressStats() {
  await requireAdmin();

  // Get user progress data
  const userProgressData = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      enrollment: {
        select: {
          Course: {
            select: {
              id: true,
              title: true,
              chapter: {
                select: {
                  lessons: {
                    select: {
                      id: true,
                      lessonProgress: {
                        select: {
                          completed: true,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  // Calculate progress for each user
  const userStats = userProgressData.map((user: UserWithEnrollments) => {
    const enrolledCourses = user.enrollment.length;
    let totalLessons = 0;
    let completedLessons = 0;

    user.enrollment.forEach((enrollment: Enrollment) => {
      const courseLessons = enrollment.Course.chapter.reduce(
        (acc: number, chapter: Chapter) => acc + chapter.lessons.length,
        0
      );
      totalLessons += courseLessons;

      const userCompletedLessons = enrollment.Course.chapter.reduce((acc: number, chapter: Chapter) => {
        return acc + chapter.lessons.reduce((lessonAcc: number, lesson: Lesson) => {
          return lessonAcc + lesson.lessonProgress.filter((progress: LessonProgress) => progress.completed).length;
        }, 0);
      }, 0);
      completedLessons += userCompletedLessons;
    });

    const progressPercentage = totalLessons > 0 
      ? (completedLessons / totalLessons) * 100 
      : 0;

    return {
      userId: user.id,
      userName: user.name || "Unknown",
      userEmail: user.email,
      enrolledCourses,
      totalLessons,
      completedLessons,
      progressPercentage: Math.round(progressPercentage * 100) / 100,
    };
  });

  return userStats;
}

export async function adminGetMonthlyProgressStats() {
  await requireAdmin();

  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  // Get lesson progress data for the last 6 months
  const progressData = await prisma.lessonProgress.findMany({
    where: {
      completed: true,
      updatedAt: {
        gte: sixMonthsAgo,
      },
    },
    select: {
      updatedAt: true,
    },
    orderBy: {
      updatedAt: "asc",
    },
  });

  // Group by month
  const monthlyData: { month: string; completions: number }[] = [];
  
  for (let i = 5; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const monthKey = date.toISOString().slice(0, 7); // YYYY-MM format
    
    monthlyData.push({
      month: monthKey,
      completions: 0,
    });
  }

  // Count completions per month
  progressData.forEach((progress) => {
    const progressMonth = progress.updatedAt.toISOString().slice(0, 7);
    const monthIndex = monthlyData.findIndex((month) => month.month === progressMonth);
    
    if (monthIndex !== -1) {
      monthlyData[monthIndex].completions++;
    }
  });

  return monthlyData;
}
