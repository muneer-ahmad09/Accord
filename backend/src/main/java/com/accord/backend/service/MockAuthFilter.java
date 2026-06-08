package com.accord.backend.service;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class MockAuthFilter extends OncePerRequestFilter {
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {

        String mockUserId = request.getHeader("X-User-Id");

        // Print to your IDE console so we can see what's happening
        System.out.println("🔥 MockAuthFilter Intercepted Request to: " + request.getRequestURI());
        System.out.println("🔥 Found X-User-Id Header: " + mockUserId);

        if (mockUserId != null && !mockUserId.isBlank()) {
            request.setAttribute("userId", mockUserId);
            System.out.println("🔥 Successfully injected userId into RequestAttributes!");
        }

        filterChain.doFilter(request, response);
    }
}