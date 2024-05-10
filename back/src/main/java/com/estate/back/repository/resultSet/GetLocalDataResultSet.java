package com.estate.back.repository.resultSet;

public interface GetLocalDataResultSet {
    
    // get- 형태로 만들면 JPA가 알아서 구현
    String getYearMonth();
    Integer getSale();
    Integer getLease();
    Integer getMonthRent();

}
