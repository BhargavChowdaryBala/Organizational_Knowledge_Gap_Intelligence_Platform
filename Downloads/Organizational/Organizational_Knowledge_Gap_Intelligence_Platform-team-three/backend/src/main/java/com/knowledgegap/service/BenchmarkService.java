package com.knowledgegap.service;

import com.knowledgegap.dto.BenchmarkResponse;

public interface BenchmarkService {

    BenchmarkResponse getBenchmark(Integer userId);

}