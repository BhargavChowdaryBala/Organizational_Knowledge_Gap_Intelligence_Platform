package com.knowledgegap.controller;


import com.knowledgegap.dto.LearningPathResponse;
import com.knowledgegap.entity.LearningPath;
import com.knowledgegap.service.LearningPathService;


import org.springframework.web.bind.annotation.*;


import java.util.List;



@RestController
@RequestMapping("/api/learning-path")
@CrossOrigin("*")
public class LearningPathController {



private final LearningPathService learningPathService;



public LearningPathController(
        LearningPathService learningPathService
){

this.learningPathService = learningPathService;

}




// Employee personalized learning path

@GetMapping("/{userId}")
public List<LearningPathResponse> getEmployeePath(
        @PathVariable Integer userId
){

return learningPathService.getLearningPath(userId);

}




// Admin create roadmap

@PostMapping
public LearningPath createLearningPath(
        @RequestBody LearningPath learningPath
){

return learningPathService
        .createLearningPath(learningPath);

}




// Get all predefined paths

@GetMapping
public List<LearningPath> getAll(){

return learningPathService
        .getAllLearningPaths();

}





@GetMapping("/id/{id}")
public LearningPath getById(
        @PathVariable Integer id
){

return learningPathService
        .getLearningPathById(id);

}





@PutMapping("/{id}")
public LearningPath update(
@PathVariable Integer id,
@RequestBody LearningPath learningPath
){

return learningPathService
.updateLearningPath(id,learningPath);

}





@DeleteMapping("/{id}")
public String delete(
@PathVariable Integer id
){

learningPathService.deleteLearningPath(id);


return "Learning Path Deleted Successfully";

}



}