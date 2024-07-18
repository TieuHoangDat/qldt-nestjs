-- CreateTable
CREATE TABLE "Accounts" (
    "account_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "date" INTEGER NOT NULL,
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "role" INTEGER NOT NULL,
    "otp" TEXT,

    CONSTRAINT "Accounts_pkey" PRIMARY KEY ("account_id")
);

-- CreateTable
CREATE TABLE "Courses" (
    "course_id" TEXT NOT NULL,
    "course_name" TEXT NOT NULL,
    "num_credit" INTEGER NOT NULL,
    "term" INTEGER NOT NULL,
    "notcal" INTEGER,

    CONSTRAINT "Courses_pkey" PRIMARY KEY ("course_id")
);

-- CreateTable
CREATE TABLE "Notifications" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Term" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "start_day" TIMESTAMP(3) NOT NULL,
    "end_day" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Term_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Groups" (
    "group_id" SERIAL NOT NULL,
    "group_name" TEXT NOT NULL,
    "course_id" TEXT NOT NULL,
    "day_of_week" INTEGER NOT NULL,
    "period" INTEGER NOT NULL,
    "teacher_id" INTEGER NOT NULL,
    "room" TEXT NOT NULL,
    "max_students" INTEGER NOT NULL,
    "available_slots" INTEGER NOT NULL,
    "term" INTEGER NOT NULL,

    CONSTRAINT "Groups_pkey" PRIMARY KEY ("group_id")
);

-- CreateTable
CREATE TABLE "CourseRegistrations" (
    "id" SERIAL NOT NULL,
    "account_id" INTEGER NOT NULL,
    "course_id" TEXT NOT NULL,
    "term" INTEGER NOT NULL,
    "registration_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CourseRegistrations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GroupRegistrations" (
    "id" SERIAL NOT NULL,
    "account_id" INTEGER NOT NULL,
    "group_id" INTEGER NOT NULL,
    "time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "grade" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "GroupRegistrations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Accounts_username_key" ON "Accounts"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Courses_course_id_key" ON "Courses"("course_id");

-- AddForeignKey
ALTER TABLE "Groups" ADD CONSTRAINT "Groups_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "Courses"("course_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Groups" ADD CONSTRAINT "Groups_teacher_id_fkey" FOREIGN KEY ("teacher_id") REFERENCES "Accounts"("account_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Groups" ADD CONSTRAINT "Groups_term_fkey" FOREIGN KEY ("term") REFERENCES "Term"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseRegistrations" ADD CONSTRAINT "CourseRegistrations_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "Accounts"("account_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseRegistrations" ADD CONSTRAINT "CourseRegistrations_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "Courses"("course_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseRegistrations" ADD CONSTRAINT "CourseRegistrations_term_fkey" FOREIGN KEY ("term") REFERENCES "Term"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupRegistrations" ADD CONSTRAINT "GroupRegistrations_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "Accounts"("account_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupRegistrations" ADD CONSTRAINT "GroupRegistrations_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "Groups"("group_id") ON DELETE RESTRICT ON UPDATE CASCADE;
