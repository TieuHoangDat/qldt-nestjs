import { ForbiddenException, Injectable } from '@nestjs/common';
// import { GroupDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateGroupRegistrationDto } from './dto/create-group-registration.dto';

@Injectable()
export class GroupRegistrationService {
    constructor(private prismaService: PrismaService){}


    async getGroupRegistrationsByUserId(userId: number) {
        let listTerm = []

        const li = await this.prismaService.term.findMany();

        for (const term of li) {
            if (term.id === 6) continue;
            const data = await this.prismaService.groupRegistration.findMany({
                include: {
                    group: {
                        include: {
                            course: true,
                        },
                    },
                },
                where: {
                    accountId: userId,
                    group: {
                        termId: term.id,
                    },
                },
            })

            // Thêm thuộc tính grade_10, grade_4 và grade_a
            const updatedData = data.map(groupRegistration => {
                // Tính toán grade_10
                const grade_10 = Math.round(groupRegistration.grade * 10.0) / 10.0;
                
                // Xác định grade_4 và grade_a
                let grade_4: number;
                let grade_a: string;
            
                if (grade_10 < 4) {
                grade_a = "F";
                grade_4 = 0;
                } else if (grade_10 < 5) {
                grade_a = "D";
                grade_4 = 1;
                } else if (grade_10 < 5.5) {
                grade_a = "D+";
                grade_4 = 1.5;
                } else if (grade_10 < 6.5) {
                grade_a = "C";
                grade_4 = 2;
                } else if (grade_10 < 7) {
                grade_a = "C+";
                grade_4 = 2.5;
                } else if (grade_10 < 8) {
                grade_a = "B";
                grade_4 = 3;
                } else if (grade_10 < 8.5) {
                grade_a = "B+";
                grade_4 = 3.5;
                } else if (grade_10 < 9) {
                grade_a = "A";
                grade_4 = 3.7;
                } else {
                grade_a = "A+";
                grade_4 = 4.0;
                }
            
                // Tạo đối tượng mới với các thuộc tính bổ sung
                return {
                ...groupRegistration,
                grade_10,
                grade_4,
                grade_a
                };
            });

            let sum10 = 0, sum4 = 0, total_credit = 0;

            updatedData.forEach(gr => {
                sum10 += gr.grade_10 * gr.group.course.num_credit
                sum4 += gr.grade_4 * gr.group.course.num_credit
                total_credit += gr.group.course.num_credit
            })

            let tmp = {
                term: term.name,
                avg_10: Math.round(sum10 / total_credit * 100.0) / 100.0,
                avg_4: Math.round(sum4 / total_credit * 100.0) / 100.0,
                tl_10: 0,
                tl_4: 0,
                total_credit: total_credit,
                tl_credit: 0,
                tuition: total_credit * 550000,
                li: updatedData
            }
            listTerm.push(tmp);
        }


        let tl_10 = 0, tl_4 = 0;
        let tl = 0;

        for (const t of listTerm) {
            tl_10 += t.avg_10 * t.total_credit;
            tl_4 += t.avg_4 * t.total_credit;
            tl += t.total_credit;
            t.tl_10 = Math.round((tl_10 / tl) * 100.0) / 100.0;
            t.tl_4 = Math.round((tl_4 / tl) * 100.0) / 100.0;
            t.tl_credit = tl;
        }
        
  
        return {
            status: "ok",
            message: "Query groupRegistration successfully",
            data: listTerm
        };
    }


    async timeTable(userId: number) {
        const user = await this.prismaService.account.findUnique({
            where: {
              account_id: userId, 
            },
        });

        if(user.role == 3) {
            const groupRegistrations = await this.prismaService.groupRegistration.findMany({
                where: {
                    accountId: userId,
                    group: {
                      termId: 6
                    }
                  },
                include: {
                  group: {
                    include: {
                      course: true, // Nếu bạn cũng muốn bao gồm thông tin về course
                      teacher: true
                    },
                  },
                },
            });
          
            // Lấy danh sách các Group từ GroupRegistration
            const groups = groupRegistrations.map(gr => gr.group);

            return {
                status: "ok",
                message: "Query groupRegistration successfully",
                data: groups
            };
        }

        if(user.role == 2) {
            const groups = await this.prismaService.group.findMany({
                where: {
                    teacherId: userId, 
                    termId: 6, 
                },
                include: {
                    course: true, // Bao gồm thông tin khóa học nếu cần
                    teacher: true
                },
            });

            return {
                status: "ok",
                message: "Query groupRegistration successfully",
                data: groups
            };
        }
    }

    async getListStudent(groupId: number) {

        const groupRegistrations = await this.prismaService.groupRegistration.findMany({
            where: {
              groupId: groupId,
            },
            include: {
              account: true, // Bao gồm thông tin của đối tượng Account
            },
          });
      
          // Trích xuất thông tin các tài khoản từ groupRegistrations
        let accounts = groupRegistrations.map(gr => gr.account);

        // Sắp xếp các tài khoản theo tên
        accounts = accounts.sort((a, b) => a.name.localeCompare(b.name));

        console.log(accounts)
  
        return {
            status: "ok",
            message: "Query groupRegistration successfully",
            data: accounts
        };
    }

    async getGRByGroupId(groupId: number) {

        const groupRegistrations = await this.prismaService.groupRegistration.findMany({
            where: {
              groupId: groupId,
            },
            include: {
              account: true, // Bao gồm thông tin của đối tượng Account
            },
        });

        // Sắp xếp các đối tượng GroupRegistration theo tên tài khoản
        const sortedGroupRegistrations = groupRegistrations.sort((a, b) => 
            a.account.name.localeCompare(b.account.name)
        );
      
  
        return {
            status: "ok",
            message: "Query groupRegistration successfully",
            data: sortedGroupRegistrations
        };
    }

    async updateGrades(groupRegistrations: { id: number, grade: number }[]) {
        try {
            const updatePromises = groupRegistrations.map(async (gr) => {
                return this.prismaService.groupRegistration.update({
                  where: { id: gr.id },
                  data: { grade: gr.grade },
                });
            });
            return {
                status: "ok",
                message: "Update grade successfully",
                data: updatePromises
            };
        } catch (error) {
            return {
                status: "ok",
                message: "Có lỗi",
            };
        }
    }


    // Đăng kí tín chỉ

    async getCRByUserId(userId: number) {

        const courseRegistrations = await this.prismaService.courseRegistration.findMany({
            where: {
              accountId: userId,
              termId: 6,
            },
            include: {
              course: true, // Bao gồm thông tin của đối tượng Course
            },
        });

        // Trích xuất thông tin course từ courseRegistrations
        const courses = courseRegistrations.map(cr => cr.course);
          
  
        return {
            status: "ok",
            message: "Query courseRegistration successfully",
            data: courses
        };
    }

    async getGRByUserId(userId: number) {

        const groupRegistrations = await this.prismaService.groupRegistration.findMany({
            where: {
              accountId: userId,
              group: {
                termId: 6,
              },
            },
            include: {
              group: {
                include: {
                  course: true,
                  teacher: true,
                },
              },
            },
        });
          
  
        return {
            status: "ok",
            message: "Query groupRegistration successfully",
            data: groupRegistrations
        };
    }

    async getGroupInCRByUserId(userId: number) {

        const courseRegistrations = await this.prismaService.courseRegistration.findMany({
            where: {
              accountId: userId,
              termId: 6,
            },
            include: {
              course: true, // Bao gồm thông tin của đối tượng Course
            },
        });
      
          // Trích xuất danh sách các courseId từ danh sách courseRegistrations
        const courseIds = courseRegistrations.map(cr => cr.course.id);
      
          // Truy vấn tất cả các group liên quan đến danh sách courseIds
        const groups = await this.prismaService.group.findMany({
            where: {
              courseId: {
                in: courseIds, // Sử dụng `in` để lọc các group liên quan đến các courseId trong danh sách
              },
            },
            include: {
                course: true,
                teacher: true
            },
            orderBy: {
                groupId: 'asc', // Sắp xếp theo groupId tăng dần
            },
        });

        const groupRegistrations = await this.prismaService.groupRegistration.findMany({
            where: {
              accountId: userId,
              group: {
                termId: 6,
              },
            },
        });
          
        // Trích xuất danh sách groupId từ groupRegistrations
        const registeredGroupIds = new Set(groupRegistrations.map(gr => gr.groupId));

        // Thêm thuộc tính registered cho từng group
        const groupsWithRegistrationStatus = groups.map(group => ({
            ...group,
            registed: registeredGroupIds.has(group.groupId),
        }));

        return {
            status: "ok",
            message: "Query groupRegistration successfully",
            data: groupsWithRegistrationStatus
        };
    }

    async getGroupInCRByUserIdAndCourseId(userId: number, courseId: string) {

          // Truy vấn tất cả các group liên quan đến danh sách courseIds
        const groups = await this.prismaService.group.findMany({
            where: {
              courseId: courseId,
            },
            include: {
                course: true,
                teacher: true
            },
            orderBy: {
                groupId: 'asc', // Sắp xếp theo groupId tăng dần
            },
        });

        const groupRegistrations = await this.prismaService.groupRegistration.findMany({
            where: {
              accountId: userId,
              group: {
                termId: 6,
              },
            },
        });
          
        // Trích xuất danh sách groupId từ groupRegistrations
        const registeredGroupIds = new Set(groupRegistrations.map(gr => gr.groupId));

        // Thêm thuộc tính registered cho từng group
        const groupsWithRegistrationStatus = groups.map(group => ({
            ...group,
            registed: registeredGroupIds.has(group.groupId),
        }));

        return {
            status: "ok",
            message: "Query groupRegistration successfully",
            data: groupsWithRegistrationStatus
        };
    }

    async create(createGroupRegistrationDto: CreateGroupRegistrationDto) {
        const { userId, groupId } = createGroupRegistrationDto;
    
        const groupRegistrations = await this.prismaService.groupRegistration.findMany({
            where: {
                accountId: userId,
                group: {
                    termId: 6,
                },
            },
            include: {
                group: true,
            },
        });
    
        const group = await this.prismaService.group.findUnique({
            include: {
                course: true,
            },
            where: {
                groupId: groupId,
            },
        });
    
        // Kiểm tra nhóm còn slot để đăng ký không
        if (group.availableSlots <= 0) {
            return {
                status: "ok",
                message: "Nhóm này đã hết chỗ",
            };
        }
    
        // Kiểm tra xem nhóm đã được đăng kí chưa
        for (const gr of groupRegistrations) {
            if (groupId === gr.groupId) {
                return {
                    status: "ok",
                    message: "Bạn đã đăng kí nhóm này",
                };
            }
        }
    
        // Kiểm tra 1 môn không thể đăng kí 2 nhóm
        for (const gr of groupRegistrations) {
            if (group.courseId == gr.group.courseId) {
                return {
                    status: "ok",
                    message: "Một môn học không thể đăng kí 2 nhóm",
                };
            }
        }
    
        // Kiểm tra xem có trùng thời khóa biểu không
        for (const gr of groupRegistrations) {
            if (gr.group.dayOfWeek == group.dayOfWeek && gr.group.period == group.period) {
                return {
                    status: "ok",
                    message: "Trùng lịch học",
                };
            }
        }
    
        const data = await this.prismaService.groupRegistration.create({
            data: {
                accountId: userId,
                groupId: groupId,
            },
        });
    
        await this.prismaService.group.update({
            where: {
                groupId: groupId,
            },
            data: {
                availableSlots: {
                    decrement: 1,
                },
            },
        });
    
        return {
            status: "ok",
            message: "Đăng kí nhóm học thành công",
            data: data,
        };
    }
    

    async deleteGRById(grId: number) {
        const gr = await this.prismaService.groupRegistration.findUnique({
            where: {
                id: grId
            },
        })

        await this.prismaService.group.update({
            where: {
              groupId: gr.groupId,
            },
            data: {
              availableSlots: {
                increment: 1,
              },
            },
        });

        const data = await this.prismaService.groupRegistration.delete({
            where: {
                id: grId
            },
        })

        return {
            status: "ok",
            message: "Hủy đăng kí nhóm thành công",
            data: data
        };
    }
}
